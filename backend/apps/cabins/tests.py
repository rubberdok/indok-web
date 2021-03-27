import json

from graphene_django.utils.testing import GraphQLTestCase


class CabinsResolversTestCase(GraphQLTestCase):
    """
    Testing all resolvers for cabins
    """
    def test_resolve_all_bookings(self):
        response = self.query(
            '''
            query {
                allBookings {
                    id
                    firstName
                    surName
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
            op_name='allBookings'
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)

