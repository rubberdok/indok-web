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
        self.firstBooking = BookingFactory(
            check_in=self.now,
            check_out=self.now + datetime.timedelta(days=4),
            cabins=[self.bjornen_cabin],
        )
        self.secondBooking = BookingFactory(
            check_in=self.now + datetime.timedelta(days=6),
            check_out=self.now + datetime.timedelta(days=12),
            cabins=[self.oksen_cabin, self.bjornen_cabin],
        )
        self.thirdBooking = BookingFactory(
            check_in=self.now + datetime.timedelta(days=24),
            check_out=self.now + datetime.timedelta(days=30),
            cabins=[self.oksen_cabin],
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
                    surname
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

    def test_create_booking(self):
        new_fake_booking = BookingFactory.build(
            check_in=self.now + datetime.timedelta(days=50),
            check_out=self.now + datetime.timedelta(days=52),
        )
        query = f"""
            mutation CreateBooking {{
                createBooking(
                bookingData: {{
                    firstname: \"{new_fake_booking.firstname}\",
                    surname: \"{new_fake_booking.surname}\",
                    phone: {new_fake_booking.phone},
                    receiverEmail: \"{new_fake_booking.receiver_email}\",
                    checkIn: \"{new_fake_booking.check_in.strftime("%Y-%m-%d")}\",
                    checkOut: \"{new_fake_booking.check_out.strftime("%Y-%m-%d")}\",
                    price: {new_fake_booking.price},
                    cabins: [{self.oksen_cabin.id}],
                    }}
                ) {{
                  ok
                }}
                }}
            """
        response = self.query(query)

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)

        # Check that booking is created
        self.assertEqual(
            1,
            len(
                Booking.objects.filter(
                    firstname=new_fake_booking.firstname, phone=new_fake_booking.phone
                )
            ),
        )

    def test_add_invalid_booking(self):
        # Try to add booking before current time
        query = f"""
            mutation CreateBooking {{
                createBooking(
                bookingData: {{
                    firstname: \"{self.firstBooking.firstname}\",
                    surname: \"{self.firstBooking.surname}\",
                    phone: {self.firstBooking.phone},
                    receiverEmail: \"{self.firstBooking.receiver_email}\",
                    checkIn: \"{(timezone.now()-datetime.timedelta(days=10)).strftime("%Y-%m-%d")}\",
                    checkOut: \"{(timezone.now()-datetime.timedelta(days=5)).strftime("%Y-%m-%d")}\",
                    price: {self.firstBooking.price},
                    cabins: [{self.bjornen_cabin.id}],
                }}
                ) {{
                  ok
                }}
            }}
        """
        response = self.query(query)
        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        # Check that booking is not created
        self.assertEqual(3, len(Booking.objects.all()))

        # Try to add booking where checkin is after checkout
        query = f"""
            mutation CreateBooking {{
                createBooking(
                    bookingData: {{
                        firstname: \"{self.firstBooking.firstname}\",
                        surname: \"{self.firstBooking.surname}\",
                        phone: {self.firstBooking.phone},
                        receiverEmail: \"{self.firstBooking.receiver_email}\",
                        checkIn: \"{(timezone.now() + datetime.timedelta(days=10)).strftime("%Y-%m-%d")}\",
                        checkOut: \"{(timezone.now()).strftime("%Y-%m-%d")}\",
                        price: {self.firstBooking.price},
                        cabins: [{self.bjornen_cabin.id}],
                    }}
                ) {{
                  ok
                }}
            }}
        """
        response = self.query(query)
        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
        # Check that booking is not created
        self.assertEqual(3, len(Booking.objects.all()))

        # Try to add booking within the same time as another booking
        query = f"""
            mutation CreateBooking {{
                createBooking(
                    bookingData: {{
                        firstname: \"{self.firstBooking.firstname}\",
                        surname: \"{self.firstBooking.surname}\",
                        phone: {self.firstBooking.phone},
                        receiverEmail: \"{self.firstBooking.receiver_email}\",
                        checkIn: \"{self.firstBooking.check_in.strftime("%Y-%m-%d")}\",
                        checkOut: \"{self.firstBooking.check_out.strftime("%Y-%m-%d")}\",
                        price: {self.firstBooking.price},
                        cabins: [{self.bjornen_cabin.id}],
                    }}
                ) {{
                  ok
                }}
            }}
        """
        response = self.query(query)
        # This validates the status code and if you get errors
        self.assertResponseHasErrors(response)
