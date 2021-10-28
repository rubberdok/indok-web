import json
import unittest.mock

from django.db import transaction
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.ecommerce import OrderFactory, ProductFactory
from utils.testing.factories.organizations import OrganizationFactory
from utils.testing.factories.users import IndokUserFactory
from utils.testing.transaction_tests import GraphQLTransactionTestCase

from apps.ecommerce.models import Product, Order
from apps.ecommerce.mutations import AttemptCapturePayment, InitiateOrder


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
    """
    Testing all mutations for ecommerce
    """

    class VippsApiMock:
        def initiate_payment(order):
            return "https://www.youtube.com/watch?v=dQw4w9WgXcQ"  # Just a random URL

        def capture_payment(order, method):
            print("Order: ", order, "\nMethod: ", method)

    def test_create_product(self):
        """
        THIS TEST MUST BE REWRITTEN!
        """

        query = """
          mutation {
            createProduct {
                product {
                    id
                    name
                    description
                    price
                    totalQuantity
                    maxBuyableQuantity
                }
                ok
                }
            }
        """
        response = self.query(query)
        self.assertResponseNoErrors(response)

        data = json.loads(response.content)["data"]
        response_product = data["createProduct"]["product"]
        product = Product.objects.get(pk=response_product["id"])
        if product is None:
            self.assertIsNotNone(product, msg="Expected product after creation, got None")
        else:
            self.assertTrue(data["createProduct"]["ok"])
            product.price = int(product.price)
            response_product["price"] = int(response_product["price"])
            self.deep_assert_equal(response_product, product)

    @unittest.mock.patch.object(InitiateOrder, "vipps_api", VippsApiMock)
    def test_initiate_order(self):
        query = (
            lambda q: f"""
        mutation InitiateOrder {{
            initiateOrder(productId: {self.product_1.id}, quantity: {q}) {{
                redirect
            }}
        }}
        """
        )

        # Unauthorized user should not be able to initiate order
        response = self.query(query(1))
        self.assert_permission_error(response)

        # Requesting more than available is not allowed
        response = self.query(query(6), user=self.indok_user)
        self.assertResponseHasErrors(response)

        # Requesting more than one user can buy is not allowed
        response = self.query(query(3), user=self.indok_user)
        self.assertResponseHasErrors(response)

        # Max is 2 per user so should be allowed to buy this
        response = self.query(query(2), user=self.indok_user)
        self.assertResponseNoErrors(response)
        data = json.loads(response.content)["data"]
        redirect_url = data["initiateOrder"]["redirect"]
        self.assertEqual(redirect_url, "https://www.youtube.com/watch?v=dQw4w9WgXcQ")

        # Already bought the total quota for the user so shouldn't be allowed to buy more
        # Need to think a bit more on this one as only captured orders are counted with this
        # response = self.query(query(1), user=self.indok_user)
        # self.assertResponseHasErrors(response)

    @unittest.mock.patch.object(AttemptCapturePayment, "vipps_api", VippsApiMock)
    def test_attempt_capture_order(self):
        query = (
            lambda id: f"""
        mutation AttemptCapturePayment {{
            attemptCapturePayment(orderId: {id}) {{
                status
                order {{
                    orderId
                    product {{
                        id
                        name
                        description
                        price
                    }}
                    quantity
                    totalPrice
                    paymentStatus
                    date
                }}
            }}
        }}
        """
        )

        # Unauthorized user should not be able to initiate order
        response = self.query(query(self.product_1.id))
        self.assert_permission_error(response)


DB1 = "default"
DB2 = "alternate"


class EcommerceMutationsTransactionTestCase(GraphQLTransactionTestCase):
    """
    Testing DB concurrency related functionality of ecommerce (DB locks).
    """

    def setUp(self) -> None:
        super().setUp()
        self.indok_user = IndokUserFactory()

        self.organization = OrganizationFactory()
        self.product_1 = ProductFactory(total_quantity=2, max_buyable_quantity=2)
        self.product_2 = ProductFactory()
        self.initiate_order_query = (
            lambda q, db: f"""
        mutation InitiateOrder {{
            initiateOrder(productId: {self.product_1.id}, quantity: {q}, db: {db}) {{
                redirect
            }}
        }}
        """
        )

    @unittest.mock.patch(InitiateOrder, "vipps_api", VippsApiMock)
    def test_initiate_order_no_lock(self):

        order_quantity = 1
        with transaction.atomic(using=DB1):
            response = self.query(self.initiate_order_query(order_quantity, DB1))
            self.assertEquals(self.product_1.current_quantity, self.product_1.current_quantity - order_quantity)
            self.assertEquals(Order.objects.all().count(), 1)

        # The first transaction has been committed
        # before we begin the second, so the lock has been released.
        with transaction.atomic(using=DB2):
            response = self.query(self.initiate_order_query(order_quantity, DB2))
            self.assertEquals(self.product_1.current_quantity, self.product_1.current_quantity - 2 * order_quantity)
            self.assertEquals(Order.objects.all().count(), 2)

    def test_initiate_order_with_lock(self):
        order_quantity = 1
        with transaction.atomic(using=DB1):
            response = self.query(self.initiate_order_query(order_quantity, DB1))
            self.assertEquals(self.product_1.current_quantity, self.product_1.current_quantity - order_quantity)
            self.assertEquals(Order.objects.all().count(), 1)

            # The first transaction has NOT been committed
            # before we begin the second, so the lock is still in effect.
            with transaction.atomic(using=DB2):
                response = self.query(self.initiate_order_query(order_quantity, DB2))
                self.assertEquals(self.product_1.current_quantity, self.product_1.current_quantity - order_quantity)
                self.assertEquals(Order.objects.all().count(), 1)

        # At this point the lock has been released
        self.assertEquals(self.product_1.current_quantity, self.product_1.current_quantity - 2 * order_quantity)
        self.assertEquals(Order.objects.all().count(), 2)
