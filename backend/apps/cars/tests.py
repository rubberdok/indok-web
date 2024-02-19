import json

from django.core import mail

from apps.cars.models import CarBooking, CarBookingResponsible, Car
from apps.cars.models import CarBookingSemester
from apps.cars.helpers import snake_case_to_camel_case, price
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.cars_factories import CarBookingFactory
import datetime

from django.utils import timezone
from utils.testing.factories.cars import CarFactory

from utils.testing.factories.users import UserFactory
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType


class CarsBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        # Create three car_bookings
        self.now = timezone.now()
        self.bjornen_car = CarFactory(name="Bjørnen")
        self.oksen_car = CarFactory(name="Oksen")
        self.first_car_booking = CarBookingFactory(
            check_in=self.now,
            check_out=self.now + datetime.timedelta(days=4),
            cars=[self.bjornen_car],
            internal_participants=4,
            external_participants=1,
        )
        self.second_car_booking = CarBookingFactory(
            check_in=self.now + datetime.timedelta(days=6),
            check_out=self.now + datetime.timedelta(days=12),
            cars=[self.oksen_car, self.bjornen_car],
            internal_participants=3,
            external_participants=4,
        )
        self.third_car_booking = CarBookingFactory(
            check_in=self.now + datetime.timedelta(days=24),
            check_out=self.now + datetime.timedelta(days=30),
            cars=[self.oksen_car],
            internal_participants=4,
            external_participants=3,
        )
        self.no_conflict_car_booking = CarBookingFactory.build(
            check_in=self.now + datetime.timedelta(days=50),
            check_out=self.now + datetime.timedelta(days=52),
            internal_participants=4,
            external_participants=2,
        )

        # Create two (logged in) users
        self.user = UserFactory()
        self.super_user = UserFactory(is_staff=True, is_superuser=True)

        # Create default car_booking responsible
        self.car_booking_responsible = CarBookingResponsible(
            first_name="Ellie", last_name="Berglund", phone="94258380", email="car_booking@indokhyttene.no", active=True
        )
        self.car_booking_responsible.save()

        self.date_fmt = "%Y-%m-%d"
        self.car_booking_semester_dict = {
            "fall_start_date": f"{self.now.strftime(self.date_fmt)}",
            "fall_end_date": f"{(self.now + datetime.timedelta(weeks=12)).strftime(self.date_fmt)}",
            "spring_start_date": f"{(self.now + datetime.timedelta(weeks=16)).strftime(self.date_fmt)}",
            "spring_end_date": f"{(self.now + datetime.timedelta(weeks=28)).strftime(self.date_fmt)}",
            "fall_semester_active": True,
            "spring_semester_active": False,
        }

        self.car_booking_semester = CarBookingSemester(**self.car_booking_semester_dict)
        self.car_booking_semester.save()

    def add_car_booking_permission(self, codename):
        content_type = ContentType.objects.get_for_model(CarBooking)
        self.user.user_permissions.add(Permission.objects.get(codename=codename, content_type=content_type))

    def create_car_booking(self, car_booking, cars_field, user=None):
        query = f"""
                mutation CreateCarBooking {{
                    createCarBooking(
                        car_bookingData: {{
                            firstName: \"{car_booking.first_name}\",
                            lastName: \"{car_booking.last_name}\",
                            phone: \"{car_booking.phone}\",
                            receiverEmail: \"{car_booking.receiver_email}\",
                            checkIn: \"{car_booking.check_in.strftime(self.date_fmt)}\",
                            checkOut: \"{car_booking.check_out.strftime(self.date_fmt)}\",
                            internalParticipants: {car_booking.internal_participants},
                            externalParticipants: {car_booking.external_participants},
                            cars: [{cars_field}],
                            }}
                        ) {{
                      ok
                        }}
                    }}
                """
        return self.query(query, user=user)


class PricingTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.bjornen_car = CarFactory(
            name="Bjørnen",
            internal_price=100,
            internal_price_weekend=150,
            external_price=200,
            external_price_weekend=400,
        )
        self.fancy_car = CarFactory(
            name="Fancy",
            internal_price=1000,
            internal_price_weekend=1500,
            external_price=2000,
            external_price_weekend=4000,
        )

    def test_internal_price_one_night(self):
        check_in = datetime.date(2023, 11, 13)  # Monday
        check_out = datetime.date(2023, 11, 14)  # Tuesday
        car_queryset = Car.objects.filter(name="Bjørnen")
        people = 12
        self.assertEqual(price(car_queryset, check_in, check_out, people, 0), self.bjornen_car.internal_price)

    def test_internal_price_one_weekend(self):
        check_in = datetime.date(2023, 11, 17)  # Friday
        check_out = datetime.date(2023, 11, 19)  # Sunday
        people = 8  # Number of people should not matter in this case
        nights = (check_out - check_in).days
        car_queryset = Car.objects.filter(name="Bjørnen")
        calculated = price(car_queryset, check_in, check_out, people, 0)
        expected = self.bjornen_car.internal_price_weekend * nights
        self.assertEqual(calculated, expected, f"Expected {expected}, got {calculated}")

    def test_uses_internal_price_when_internal_participants_are_more_than_external(self):
        check_in = datetime.date(2023, 11, 13)  # Monday
        check_out = datetime.date(2023, 11, 14)  # Tuesday
        car_queryset = Car.objects.filter(name="Bjørnen")
        internal_participants = 8
        external_participants = 5
        calculated = price(car_queryset, check_in, check_out, internal_participants, external_participants)
        expected = self.bjornen_car.internal_price
        self.assertEqual(calculated, expected, f"Expected {expected}, got {calculated}")

    def test_uses_external_price_when_external_participants_are_more_than_internal(self):
        check_in = datetime.date(2023, 11, 13)
        check_out = datetime.date(2023, 11, 14)
        car_queryset = Car.objects.filter(name="Bjørnen")
        internal_participants = 5
        external_participants = 8
        self.assertEqual(
            price(car_queryset, check_in, check_out, internal_participants, external_participants),
            (self.bjornen_car.external_price),
        )

    def test_uses_internal_price_when_internal_participants_are_equal_to_external(self):
        check_in = datetime.date(2023, 11, 13)
        check_out = datetime.date(2023, 11, 14)
        car_queryset = Car.objects.filter(name="Bjørnen")
        internal_participants = 5
        external_participants = 5
        self.assertEqual(
            price(car_queryset, check_in, check_out, internal_participants, external_participants),
            (self.bjornen_car.internal_price),
        )

    def test_uses_price_mix_for_thursday_to_saturday(self):
        check_in = datetime.date(2023, 11, 16)  # Thursday
        check_out = datetime.date(2023, 11, 18)  # Saturday
        car_queryset = Car.objects.filter(name="Bjørnen")
        internal_participants = 0
        external_participants = 9
        self.assertEqual(
            price(car_queryset, check_in, check_out, internal_participants, external_participants),
            (+self.bjornen_car.external_price + self.bjornen_car.external_price_weekend),
        )

    def test_multiple_cars(self):
        check_in = datetime.date(2023, 11, 17)  # Friday
        check_out = datetime.date(2023, 11, 19)  # Sunday
        internal_participants = 0
        external_participants = 30
        nights = (check_out - check_in).days
        car_queryset = Car.objects.filter(name__in=["Bjørnen", "Fancy"])
        self.assertEqual(
            price(car_queryset, check_in, check_out, internal_participants, external_participants),
            (self.bjornen_car.external_price_weekend + self.fancy_car.external_price_weekend) * nights,
        )


class CarsResolversTestCase(CarsBaseTestCase):
    """
    Testing all resolvers for cars
    """

    def test_resolve_all_car_bookings(self):
        response = self.query(
            """
            query {
                allCarBookings {
                    id
                    checkIn
                    checkOut
                    cars {
                        id
                        name
                    }
                }
            }
            """,
        )
        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
        # Fetching content of response
        content = json.loads(response.content)

        # There are three car_bookings in the database
        self.assertEqual(len(content["data"]["allCarBookings"]), 3)

    def test_resolve_admin_all_car_bookings(self):
        query = """
            query {
                adminAllCarBookings {
                    id
                    checkIn
                    checkOut
                    cars {
                        id
                        name
                    }
                    firstName
                    lastName
                }
            }
            """
        # Try to make query without permission
        response = self.query(query, user=self.user)
        # This validates the status code and if you get errors
        self.assert_permission_error(response)

        # Try to make query with permission
        self.add_car_booking_permission("manage_car_booking")
        response = self.query(query, user=self.user)
        self.assertResponseNoErrors(response)
        # Fetching content of response
        content = json.loads(response.content)

        # There are three car_bookings in the database
        self.assertEqual(len(content["data"]["adminAllCarBookings"]), 3)

    def test_resolve_cars(self):
        response = self.query(
            """
            query AllCars {
                cars {
                  id
                  name
                  maxGuests
                  internalPrice
                  externalPrice
                }
              }
            """,
        )
        # This validates the status code and if you get errors

        self.assertResponseNoErrors(response)
        # Fetching content of response
        content = json.loads(response.content)

        # There are two cars in the database
        self.assertEqual(len(content["data"]["cars"]), 2)


class CarsMutationsTestCase(CarsBaseTestCase):
    """
    Testing all mutations for cars
    """

    def check_create_with_error(self, response):
        self.assertResponseHasErrors(response)
        # Check that car_booking is not created
        self.assertEqual(3, len(CarBooking.objects.all()))

    def test_create_car_booking(self):
        response = self.create_car_booking(self.no_conflict_car_booking, f"{self.bjornen_car.id}", user=self.user)
        self.assertResponseNoErrors(response)
        # Check that car_booking is created
        self.assertTrue(
            CarBooking.objects.filter(
                first_name=self.no_conflict_car_booking.first_name,
                phone=self.no_conflict_car_booking.phone,
            ).exists()
        )

    def test_add_invalid_car_booking(self):
        # Try to add car_booking before current time
        self.first_car_booking.check_in = timezone.now() - datetime.timedelta(days=10)
        self.first_car_booking.check_in = timezone.now() - datetime.timedelta(days=5)
        response = self.create_car_booking(self.first_car_booking, f"{self.bjornen_car.id}")
        self.check_create_with_error(response)

        # Try to add car_booking where checkin is after checkout
        self.first_car_booking.check_in = timezone.now() + datetime.timedelta(days=10)
        self.first_car_booking.check_in = timezone.now()
        response = self.create_car_booking(self.first_car_booking, f"{self.bjornen_car.id}")
        self.check_create_with_error(response)

        # Try to add car_booking within the same time as another car_booking
        response = self.create_car_booking(self.third_car_booking, f"{self.oksen_car.id}")
        # This validates the status code and if you get errors
        self.check_create_with_error(response)

    def test_invalid_email(self):
        self.no_conflict_car_booking.receiver_email = "oda.norwegian123.no"
        response = self.create_car_booking(self.no_conflict_car_booking, f"{self.oksen_car.id}")
        self.check_create_with_error(response)

    def test_empty_first_name(self):
        # Try to add a car_booking with no first name variable
        self.no_conflict_car_booking.first_name = ""
        response = self.create_car_booking(self.no_conflict_car_booking, f"{self.oksen_car.id}")
        self.check_create_with_error(response)

    def test_empty_last_name(self):
        # Try to add a car_booking with no last name variable
        self.no_conflict_car_booking.last_name = ""
        response = self.create_car_booking(self.no_conflict_car_booking, f"{self.oksen_car.id}")
        self.check_create_with_error(response)

    def test_phone_number(self):
        # Try to make car with invalid phone number
        self.no_conflict_car_booking.phone = "26832732"
        response = self.create_car_booking(self.no_conflict_car_booking, f"{self.oksen_car.id}")
        self.check_create_with_error(response)

    def test_sum_of_participants_cannot_exceed_limit(self):
        # Try to add a car_booking with more participants than total capacity of car
        self.no_conflict_car_booking.internal_participants = 15
        self.no_conflict_car_booking.external_participants = 7
        response = self.create_car_booking(self.no_conflict_car_booking, f"{self.oksen_car.id}")
        self.check_create_with_error(response)
        # Try to add a car_booking with more participants than total capacity of cars
        self.no_conflict_car_booking.internal_participants = 19
        self.no_conflict_car_booking.external_participants = 21
        response = self.create_car_booking(self.no_conflict_car_booking, f"{self.oksen_car.id}, {self.bjornen_car.id}")
        self.check_create_with_error(response)

    def test_no_checkin_and_checkout_on_same_day(self):
        self.first_car_booking.check_in = timezone.now()
        self.first_car_booking.check_in = timezone.now()
        response = self.create_car_booking(self.first_car_booking, f"{self.bjornen_car.id}")
        self.check_create_with_error(response)

    def test_update_car_booking(self):
        query = f"""
        mutation {{
          updateCarBooking(car_bookingData: {{id: {self.first_car_booking.id}, firstName: \"Sverre\", lastName: \"Spetalen\"}}) {{
            ok
            car_booking {{
              id
            }}
          }}
        }}
        """
        # Change car_booking without permission
        response = self.query(query)
        self.assert_permission_error(response)

        # Change car_booking with change_car_booking permission
        self.add_car_booking_permission("manage_car_booking")
        response = self.query(query, user=self.user)

        # Fetch updated car_booking
        self.first_car_booking = CarBooking.objects.get(pk=self.first_car_booking.id)
        self.assertResponseNoErrors(response)
        self.assertEqual("Sverre", self.first_car_booking.first_name)
        self.assertEqual("Spetalen", self.first_car_booking.last_name)

    def test_delete_car_booking(self):
        query = f"""
                mutation {{
                  deleteCarBooking(id: {self.first_car_booking.id}) {{
                    ok
                    car_bookingId
                  }}
                }}
                """
        response = self.query(query)
        # Check that unauthorized user cannot delete car_booking
        self.assert_permission_error(response)
        try:
            CarBooking.objects.get(pk=self.first_car_booking.id)
        except CarBooking.DoesNotExist:
            self.assertTrue(True, "The car_booking was deleted after unauthorized user tried to delete")
        self.add_car_booking_permission("manage_car_booking")
        response = self.query(query, user=self.user)
        self.assertResponseNoErrors(response)
        with self.assertRaises(CarBooking.DoesNotExist):
            CarBooking.objects.get(pk=self.first_car_booking.id)

    def test_update_car(self):
        max_guests = 10

        query = f"""
              mutation UpdateCar {{
                updateCar(carData: {{
                    id: \"{self.oksen_car.id}\",
                    name: \"{self.oksen_car.name}\",
                    maxGuests: {max_guests},
                }}) {{
                    car {{
                        id
                        maxGuests
                    }}
                }}
            }}
        """

        # Check that unauthorized user cannot update car
        response = self.query(query)
        self.assert_permission_error(response)

        # Check that an authorized user can update cars
        response = self.query(query, user=self.super_user)
        self.assertResponseNoErrors(response)

        # Check that updated data is correct
        content = json.loads(response.content)
        updated_car = content["data"]["updateCar"]["car"]
        self.assertEquals(updated_car["maxGuests"], max_guests)


class EmailTestCase(CarsBaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        mail.outbox = []
        self.test_question = "This is a test question"

    def send_email(self, car_booking, email_type: str = "reserve_car_booking", user=None):
        # cars: [{self.oksen_car.id}],
        query = f"""
            mutation {{
              CarsendEmail(
                emailInput: {{
                  firstName: \"{car_booking.first_name}\",
                  lastName: \"{car_booking.last_name}\",
                  receiverEmail: \"{car_booking.receiver_email}\",
                  phone: \"{car_booking.phone}\",
                  internalParticipants: {car_booking.internal_participants},
                  externalParticipants: {car_booking.external_participants},

                  checkIn: \"{car_booking.check_in.strftime(self.date_fmt)}\",
                  checkOut: \"{car_booking.check_out.strftime(self.date_fmt)}\",
                  emailType: \"{email_type}\",
                  extraInfo: \"{self.test_question}\",
                }}
              ){{
                ok
              }}
            }}
        """
        return self.query(query, user=user)

    def test_outbox_size_reservation(self):
        # Check outbox size when sending reservation mails to both admin and user
        response = self.send_email(self.first_car_booking, "reserve_car_booking", user=self.super_user)
        self.assertResponseNoErrors(resp=response)
        self.assertEqual(len(mail.outbox), 2)

    def test_outbox_size_decision(self):
        # Check outbox size when sending the decision (approve or disapprove) mail to the user
        response = self.send_email(self.first_car_booking, "approve_car_booking", user=self.super_user)
        self.assertResponseNoErrors(resp=response)
        self.assertEqual(len(mail.outbox), 1)

    def test_subject_reservation(self):
        response = self.send_email(self.first_car_booking, user=self.super_user)
        self.assertResponseNoErrors(resp=response)

        # Verify that the subject of the first message is correct.
        self.assertEqual(mail.outbox[0].subject, "Bekreftelse på mottatt søknad om car_booking av Oksen")

    def test_subject_approval(self):
        response = self.send_email(self.first_car_booking, "approve_car_booking", user=self.super_user)
        self.assertResponseNoErrors(resp=response)

        # Verify that the subject of the first message is correct.
        self.assertTrue("Hytteforeningen har tatt stilling til søknaden din om car_booking av" in mail.outbox[0].subject)

    def test_reservation_mail_content(self):
        response = self.send_email(self.first_car_booking, "reserve_car_booking", user=self.super_user)
        self.assertResponseNoErrors(resp=response)

        # Verify that the mails contain the price
        self.assertTrue(str(self.first_car_booking.price) in mail.outbox[0].body)
        self.assertTrue(str(self.first_car_booking.price) in mail.outbox[1].body)

        # Verify that the admin email contains the correct contact info
        self.assertTrue(self.first_car_booking.first_name in mail.outbox[1].body)
        self.assertTrue(self.first_car_booking.last_name in mail.outbox[1].body)
        self.assertTrue(self.first_car_booking.first_name in mail.outbox[1].body)
        self.assertTrue(str(self.first_car_booking.phone) in mail.outbox[1].body)
        self.assertTrue(f"Antall indøkere: {self.first_car_booking.internal_participants}" in mail.outbox[1].body)
        self.assertTrue(f"Antall eksterne: {self.first_car_booking.external_participants}" in mail.outbox[1].body)

        # Verify that the checkin and checkout for admin and user email is correct
        date_fmt = "%d-%m-%Y"
        self.assertTrue(self.first_car_booking.check_in.strftime(date_fmt) in mail.outbox[0].body)
        self.assertTrue(self.first_car_booking.check_out.strftime(date_fmt) in mail.outbox[0].body)
        self.assertTrue(self.first_car_booking.check_in.strftime(date_fmt) in mail.outbox[1].body)
        self.assertTrue(self.first_car_booking.check_out.strftime(date_fmt) in mail.outbox[1].body)

        # Verify that the email contains the correct question provided by the user
        self.assertTrue(self.test_question in mail.outbox[0].body)


class CarBookingSemesterTestCase(CarsBaseTestCase):
    def setUp(self) -> None:
        super().setUp()

    def update_car_booking_semester(self, user=None):
        query = """
        mutation UpdateCarBookingSemester{
            updateCarBookingSemester(semesterData: {
                fallStartDate: "2021-09-01",
                fallEndDate: "2021-11-29",
                springStartDate: "2022-01-01",
                springEndDate: "2022-01-05",
                fallSemesterActive: false,
                springSemesterActive: true
            }) {
                car_bookingSemester {
                    fallStartDate
                    fallSemesterActive
                }
            }
        }"""
        # Default to super user
        if user is None:
            user = self.super_user

        return self.query(query, user=user)

    def test_resolve_car_booking_semester(self):
        query = """
        query CarBookingSemesters {
            car_bookingSemester {
                fallStartDate
                fallEndDate
                springStartDate
                springEndDate
                fallSemesterActive
                springSemesterActive
            }
        }
        """

        response = self.query(query)
        self.assertResponseNoErrors(response)

        # Fetching content of response
        content = json.loads(response.content)
        car_booking_semester = content["data"]["car_bookingSemester"]

        for key, value in self.car_booking_semester_dict.items():
            self.assertEquals(value, car_booking_semester[snake_case_to_camel_case(key)])

    # Verify that the car_booking is inside a car_booking semester
    def test_car_booking_inside_car_booking_semester(self):
        self.first_car_booking.check_in = datetime.datetime.strptime(
            self.car_booking_semester_dict["fall_start_date"], self.date_fmt
        ) + datetime.timedelta(days=1)
        self.first_car_booking.check_out = datetime.datetime.strptime(
            self.car_booking_semester_dict["fall_start_date"], self.date_fmt
        ) + datetime.timedelta(days=3)

        response = self.create_car_booking(self.first_car_booking, cars_field=f"{self.oksen_car.id}", user=self.super_user)
        self.assertResponseNoErrors(response)

    # Verify that a car_booking outside of car_booking semester is invalid
    def test_car_booking_outside_car_booking_semester(self):
        self.first_car_booking.check_in = datetime.datetime.strptime(
            self.car_booking_semester_dict["spring_end_date"], self.date_fmt
        ) + datetime.timedelta(days=1)
        self.first_car_booking.check_out = datetime.datetime.strptime(
            self.car_booking_semester_dict["spring_end_date"], self.date_fmt
        ) + datetime.timedelta(days=3)

        response = self.create_car_booking(
            self.first_car_booking, cars_field=f"{self.bjornen_car.id}", user=self.super_user
        )
        self.assertResponseHasErrors(response)

    # Verify that a car_booking inside an inactive car_booking semester is invalid
    def test_car_booking_in_inactive_car_booking_semester(self):
        self.first_car_booking.check_in = datetime.datetime.strptime(
            self.car_booking_semester_dict["spring_start_date"], self.date_fmt
        ) + datetime.timedelta(days=1)
        self.first_car_booking.check_out = datetime.datetime.strptime(
            self.car_booking_semester_dict["spring_start_date"], self.date_fmt
        ) + datetime.timedelta(days=3)

        response = self.create_car_booking(
            self.first_car_booking, cars_field=f"{self.bjornen_car.id}", user=self.super_user
        )
        self.assertResponseHasErrors(response)

    def test_update_car_booking_semester(self):
        response = self.update_car_booking_semester()
        self.assertResponseNoErrors(response)

        # Fetching content of response
        content = json.loads(response.content)
        car_booking_semester = content["data"]["updateCarBookingSemester"]["car_bookingSemester"]

        self.assertEquals(car_booking_semester["fallStartDate"], "2021-09-01")
        self.assertEquals(car_booking_semester["fallSemesterActive"], False)

    # Verify that updating the car_booking semester creates a new car_booking semester if there are no car_booking
    # semesters in the database.
    def test_update_car_booking_semester_when_not_exists(self):
        # Delete car_booking semester in db
        CarBookingSemester.objects.all().delete()

        # Update non-existing car_booking semester
        response = self.update_car_booking_semester()
        self.assertResponseNoErrors(response)

        # Assert that a new car_booking semester has been created
        self.assertEquals(len(CarBookingSemester.objects.all()), 1)

    # Verify that a normal user cannot update a car_booking semester
    def test_update_car_booking_semester_without_permission(self):
        # Assert error when no permission
        response = self.update_car_booking_semester(user=self.user)
        self.assert_permission_error(response)

        # Add permission
        content_type = ContentType.objects.get_for_model(CarBookingSemester)
        permission = Permission.objects.get(codename="change_car_bookingsemester", content_type=content_type)
        self.user.user_permissions.add(permission)

        # Assert no error when updating car_booking semester with permission
        response = self.update_car_booking_semester(user=self.user)
        self.assertResponseNoErrors(response)
