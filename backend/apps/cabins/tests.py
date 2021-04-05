import json

from apps.cabins.models import Booking
from utils.testing.ExtendedGraphQLTestCase import ExtendedGraphQLTestCase
from utils.testing.cabins_factories import BookingFactory
import datetime


class CabinsBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        # Create three bookings
        self.now = datetime.datetime.now()
        self.firstBooking = BookingFactory(
            check_in=self.now, check_out=self.now + datetime.timedelta(days=4)
        )
        self.secondBooking = BookingFactory(
            check_in=self.now + datetime.timedelta(days=6),
            check_out=self.now + datetime.timedelta(days=12),
        )
        self.thirdBooking = BookingFactory(
            check_in=self.now + datetime.timedelta(days=24),
            check_out=self.now + datetime.timedelta(days=30),
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
                  firstname: \"{new_fake_booking.firstname}\",
                  surname: \"{new_fake_booking.surname}\",
                  phone: {new_fake_booking.phone},
                  receiverEmail: \"{new_fake_booking.receiver_email}\",
                  checkIn: \"{new_fake_booking.check_in.strftime("%Y-%m-%d")}\",
                  checkOut: \"{new_fake_booking.check_out.strftime("%Y-%m-%d")}\",
                  price: {new_fake_booking.price},
                  cabins: [1],
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
