import json

from apps.cabins.models import Booking, Cabin
from utils.testing.ExtendedGraphQLTestCase import ExtendedGraphQLTestCase
from utils.testing.cabins_factories import BookingFactory
import datetime

from django.utils import timezone


class CabinsBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        # Create three bookings
        self.now = timezone.now()
        self.bjornen_cabin = Cabin.objects.get(name="Bjørnen")
        self.oksen_cabin = Cabin.objects.get(name="Oksen")
        self.first_booking = BookingFactory(
            check_in=self.now,
            check_out=self.now + datetime.timedelta(days=4),
            cabins=[self.bjornen_cabin],
        )
        self.second_booking = BookingFactory(
            check_in=self.now + datetime.timedelta(days=6),
            check_out=self.now + datetime.timedelta(days=12),
            cabins=[self.oksen_cabin, self.bjornen_cabin],
        )
        self.third_booking = BookingFactory(
            check_in=self.now + datetime.timedelta(days=24),
            check_out=self.now + datetime.timedelta(days=30),
            cabins=[self.oksen_cabin],
        )
        self.no_conflict_booking = BookingFactory.build(
            check_in=self.now + datetime.timedelta(days=50),
            check_out=self.now + datetime.timedelta(days=52),
        )
        

class CabinsResolversTestCase(CabinsBaseTestCase):
    """
    Testing all resolvers for cabins
    """

    def test_resolve_all_bookings(self):
        response = self.query(
            """
            query {
                allBookings {
                    id
                    firstname
                    lastname
                    phone
                    receiverEmail
                    checkIn
                    checkOut
                    price
                    cabins {
                        id
                        name
                    }
                    timestamp
                }
            }
            """,
        )
        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
        # Fetching content of response
        content = json.loads(response.content)

        # There are three bookings in the database
        self.assertEqual(len(content["data"]["allBookings"]), 3)

    def test_resolve_cabins(self):
        response = self.query(
            """
            query AllCabins {
                cabins {
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

        # There are two cabins in the database
        self.assertEqual(len(content["data"]["cabins"]), 2)


class CabinsMutationsTestCase(CabinsBaseTestCase):
    """
    Testing all mutations for cabins
    """

    def create_booking(self, booking, cabins_field):
        query = f"""
                mutation CreateBooking {{
                    createBooking(
                        bookingData: {{
                            firstname: \"{booking.firstname}\",
                            lastname: \"{booking.lastname}\",
                            phone: \"{booking.phone}\",
                            receiverEmail: \"{booking.receiver_email}\",
                            checkIn: \"{booking.check_in.strftime("%Y-%m-%d")}\",
                            checkOut: \"{booking.check_out.strftime("%Y-%m-%d")}\",
                            internalParticipants: {booking.internal_participants},
                            externalParticipants: {booking.external_participants},
                            cabins: [{cabins_field}],
                            }}
                        ) {{
                      ok
                        }}
                    }}
                """
        return self.query(query)

    def check_create_with_error(self, response):
        self.assertResponseHasErrors(response)
        # Check that booking is not created
        self.assertEqual(3, len(Booking.objects.all()))

    def test_create_booking(self):
        response = self.create_booking(
            self.no_conflict_booking, f"{self.bjornen_cabin.id}"
        )
        self.assertResponseNoErrors(response)
        # Check that booking is created
        self.assertTrue(
            Booking.objects.filter(
                firstname=self.no_conflict_booking.firstname,
                phone=self.no_conflict_booking.phone,
            ).exists()
        )

    def test_add_invalid_booking(self):
        # Try to add booking before current time
        self.first_booking.check_in = timezone.now() - datetime.timedelta(days=10)
        self.first_booking.check_in = timezone.now() - datetime.timedelta(days=5)
        response = self.create_booking(self.first_booking, f"{self.bjornen_cabin.id}")
        self.check_create_with_error(response)

        # Try to add booking where checkin is after checkout
        self.first_booking.check_in = timezone.now() + datetime.timedelta(days=10)
        self.first_booking.check_in = timezone.now()
        response = self.create_booking(self.first_booking, f"{self.bjornen_cabin.id}")
        self.check_create_with_error(response)

        # Try to add booking within the same time as another booking
        response = self.create_booking(self.third_booking, f"{self.oksen_cabin.id}")
        # This validates the status code and if you get errors
        self.check_create_with_error(response)

    def test_invalid_email(self):
        self.no_conflict_booking.receiver_email = "oda.norwegian123.no"
        response = self.create_booking(
            self.no_conflict_booking, f"{self.oksen_cabin.id}"
        )
        self.check_create_with_error(response)

    def test_empty_firstname(self):
        # Try to add a booking with no first name variable
        self.no_conflict_booking.firstname = ""
        response = self.create_booking(
            self.no_conflict_booking, f"{self.oksen_cabin.id}"
        )
        self.check_create_with_error(response)

    def test_empty_lastname(self):
        # Try to add a booking with no last name variable
        self.no_conflict_booking.lastname = ""
        response = self.create_booking(
            self.no_conflict_booking, f"{self.oksen_cabin.id}"
        )
        self.check_create_with_error(response)

    def test_phone_number(self):
        # Try to make cabin with invalid phone number
        self.no_conflict_booking.phone = "26832732"
        response = self.create_booking(
            self.no_conflict_booking, f"{self.oksen_cabin.id}"
        )
        self.check_create_with_error(response)

    def test_sum_of_participants_cannot_exceed_limit(self):
        # Try to add a booking with more participants than total capacity of cabin
        self.no_conflict_booking.internal_participants = 15
        self.no_conflict_booking.external_participants = 7
        response = self.create_booking(
            self.no_conflict_booking, f"{self.oksen_cabin.id}"
        )
        self.check_create_with_error(response)
        # Try to add a booking with more participants than total capacity of cabins
        self.no_conflict_booking.internal_participants = 19
        self.no_conflict_booking.external_participants = 21
        response = self.create_booking(
            self.no_conflict_booking, f"{self.oksen_cabin.id}, {self.bjornen_cabin}"
        )
        self.check_create_with_error(response)

    def test_no_checkin_and_checkout_on_same_day(self):
        self.first_booking.check_in = timezone.now()
        self.first_booking.check_in = timezone.now()
        response = self.create_booking(self.first_booking, f"{self.bjornen_cabin.id}")
        self.check_create_with_error(response)
