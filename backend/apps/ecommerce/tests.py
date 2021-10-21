# Create your tests here.
import json

from utils.testing.ExtendedGraphQLTestCase import ExtendedGraphQLTestCase
from utils.testing.factories.ecommerce import OrderFactory, ProductFactory
from utils.testing.factories.organizations import OrganizationFactory

from utils.testing.factories.users import IndokUserFactory


class EcommerceBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.indok_user = IndokUserFactory()
        self.organization = OrganizationFactory()
        self.product_1 = ProductFactory()
        self.product_2 = ProductFactory()
        self.order = OrderFactory(product=self.product_1, user=self.indok_user)


class EcommerceResolversTestCase(EcommerceBaseTestCase):
    """
    Testing all resolvers for ecommerce
    """

    def test_resolve_products(self):
        query = """
                query products {
                    products {
                        id
                        name
                        description
                        price
                    }
                }
                """
        response = self.query(query)
        self.assertResponseNoErrors(response)

        # Fetching content of response
        content = json.loads(response.content)

        # There are two products in the database
        self.assertEqual(len(content["data"]["products"]), 2)

    def test_resolve_order(self):
        query = f"""
                query Order{{
                        order(orderId: "{self.order.order_id}") {{
                            orderId
                            product {{
                                id
                                name
                            }}
                            user {{
                                username
                            }}
                            quantity
                            totalPrice
                            paymentStatus
                            date
                        }}
                    }}
                """
        # Unauthorized user should not be able to retrieve order
        response = self.query(query)
        self.assert_permission_error(response)

        # Authorized user should be able to retrieve order
        response = self.query(query, user=self.indok_user)
        self.assertResponseNoErrors(response)

    def test_resolve_user_orders(self):
        query = """
                query userOrders {
                    userOrders {
                        orderId
                            product {
                                id
                                name
                            }
                            user {
                                username
                            }
                            quantity
                            totalPrice
                            paymentStatus
                            date
                    }
                }
                """

        # Unauthorized user should not be able to retrieve orders
        response = self.query(query)
        self.assert_permission_error(response)

        # Authorized user should be able to retrieve orders
        response = self.query(query, user=self.indok_user)
        self.assertResponseNoErrors(response)

        # Fetching content of response
        content = json.loads(response.content)

        # There is one order in the database
        self.assertEqual(len(content["data"]["userOrders"]), 1)


class EcommerceMutationsTestCase(EcommerceBaseTestCase):
    ...
