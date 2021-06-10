import json

from django.core import mail

from apps.cabins.models import Booking, Cabin
from utils.testing.ExtendedGraphQLTestCase import ExtendedGraphQLTestCase
from utils.testing.cabins_factories import BookingFactory
import datetime

from django.utils import timezone

from utils.testing.factories.users import UserFactory
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType


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

        # Create two (logged in) users
        self.user = UserFactory()
        self.super_user = UserFactory(is_staff=True, is_superuser=True)

    def add_booking_permission(self, codename):
        content_type = ContentType.objects.get_for_model(Booking)
        self.user.user_permissions.add(
            Permission.objects.get(codename=codename, content_type=content_type)
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
                    checkIn
                    checkOut
                    cabins {
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

        # There are three bookings in the database
        self.assertEqual(len(content["data"]["allBookings"]), 3)

    def test_resolve_admin_all_bookings(self):
        query = """
            query {
                adminAllBookings {
                    id
                    checkIn
                    checkOut
                    cabins {
                        id
                        name
                    }
                    firstname
                    lastname
                }
            }
            """
        # Try to make query without permission
        response = self.query(query, user=self.user)
        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)

        # Try to make query with permission
        self.add_booking_permission("view_booking")
        response = self.query(query, user=self.user)
        self.assertResponseNoErrors(response)
        # Fetching content of response
        content = json.loads(response.content)

        # There are three bookings in the database
        self.assertEqual(len(content["data"]["adminAllBookings"]), 3)

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

    def test_update_booking(self):
        query = f"""
        mutation {{
          updateBooking(bookingData: {{id: {self.first_booking.id}, firstname: \"Sverre\", lastname: \"Spetalen\"}}) {{
            ok
            booking {{
              id
            }}
          }}
        }}
        """
        response = self.query(query)
        self.assertResponseHasErrors(response)
        self.add_booking_permission("change_booking")
        response = self.query(query, user=self.user)

        # Fetch updated booking
        self.first_booking = Booking.objects.get(pk=self.first_booking.id)
        self.assertResponseNoErrors(response)
        self.assertEqual("Sverre", self.first_booking.firstname)
        self.assertEqual("Spetalen", self.first_booking.lastname)

    def test_delete_booking(self):
        query = f"""
                mutation {{
                  deleteBooking(id: {self.first_booking.id}) {{
                    ok
                    bookingId
                  }}
                }}
                """
        response = self.query(query)
        # Check that unauthorized user cannot delete booking
        self.assertResponseHasErrors(response)
        try:
            booking = Booking.objects.get(pk=self.first_booking.id)
        except Booking.DoesNotExist:
            self.assertTrue(
                True, "The booking was deleted after unauthorized user tried to delete"
            )
        self.add_booking_permission("delete_booking")
        response = self.query(query, user=self.user)
        self.assertResponseNoErrors(response)
        with self.assertRaises(Booking.DoesNotExist):
            booking = Booking.objects.get(pk=self.first_booking.id)


class EmailTestCase(CabinsBaseTestCase):
    def test_send_email(self):
        # Send message.

        print("testing")

        query = f"""
            mutation {{
              sendEmail(
                emailInput: {{
                  firstname: \"{self.first_booking.firstname}\", 
                  lastname: \"{self.first_booking.lastname}\", 
                  receiverEmail: "herman.holmoy12@gmail.com", 
                  phone: "42345678", 	
                  internalParticipants: 3, 
                  externalParticipants: 3, 
                  cabins: [1, 2], 
                  checkIn: "2021-04-20", 
                  checkOut: "2021-04-23",
                  emailType:"reserve_booking"
                }}
              ){{
                 {{
                ok
              }}
            }}
        """

        response = self.query(query)
        print(mail.outbox)

        # Test that one message has been sent.
        self.assertEqual(len(mail.outbox), 1)

        # Verify that the subject of the first message is correct.
        self.assertEqual(mail.outbox[0].subject, 'Subject here')
