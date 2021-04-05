from utils.ExtendedGraphQLTestCase import ExtendedGraphQLTestCase


class CabinsResolversTestCase(ExtendedGraphQLTestCase):
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
        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)