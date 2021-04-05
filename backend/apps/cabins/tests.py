import json

from utils.testing.ExtendedGraphQLTestCase import ExtendedGraphQLTestCase
from utils.testing.cabins_factories import BookingFactory
import datetime


class CabinsBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        # Create three bookings
        now = datetime.datetime.now()
        self.firstBooking = BookingFactory(check_in=now, check_out=now + datetime.timedelta(days=4))
        self.secondBooking = BookingFactory(
            check_in=now + datetime.timedelta(days=6),
            check_out=now + datetime.timedelta(days=12)
        )
        self.thirdBooking = BookingFactory(
            check_in=now + datetime.timedelta(days=24),
            check_out=now + datetime.timedelta(days=30)
        )


class CabinsResolversTestCase(CabinsBaseTestCase):
    """
    Testing all resolvers for cabins
    """
    def test_resolve_all_bookings(self):
        response = self.query(
            '''
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
            ''',
        )
        # Fetching content of response
        content = json.loads(response.content)

        # There are three bookings in the database
        self.assertEqual(len(content["data"]["allBookings"]), 3)
        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)

    def test_resolve_cabins(self):
        response = self.query(
            '''
            query AllCabins {
                cabins {
                  id
                  name
                  maxGuests
                  internalPrice
                  externalPrice
                }
              }
            ''',
        )
        # Fetching content of response
        content = json.loads(response.content)

        # There are two cabins in the database
        self.assertEqual(len(content["data"]["cabins"]), 2)
        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)