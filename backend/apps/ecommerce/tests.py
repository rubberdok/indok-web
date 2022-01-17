import json
import unittest.mock

from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.ecommerce import OrderFactory, ProductFactory
from utils.testing.factories.organizations import OrganizationFactory
from utils.testing.factories.users import IndokUserFactory, StaffUserFactory

from apps.ecommerce.models import Product, Order

import uuid


class EcommerceBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.indok_user = IndokUserFactory()
        self.staff_user = StaffUserFactory()
        self.organization = OrganizationFactory()
        self.product_1 = ProductFactory()
        self.product_2 = ProductFactory()
        self.order_1 = OrderFactory(product=self.product_1, user=self.indok_user)
        self.initiated_order = OrderFactory(
            id=uuid.uuid4().hex,
            product=self.product_2,
            user=self.indok_user,
            payment_status=Order.PaymentStatus.INITIATED,
        )
        self.reserved_order = OrderFactory(
            id=uuid.uuid4().hex,
            product=self.product_2,
            user=self.indok_user,
            payment_status=Order.PaymentStatus.RESERVED,
        )

        self.RETRIEVE_ORDER_QUERY = f"""
                query Order{{
                        order(orderId: "{self.order_1.id}") {{
                            id
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
        self.RETRIEVE_USER_ORDERS_QUERY = """
                query userOrders {
                    userOrders {
                        id
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
        self.INITIATE_ORDER_MUTATION = (
            lambda q: f"""
        mutation InitiateOrder {{
            initiateOrder(productId: {self.product_1.id}, quantity: {q}) {{
                redirect
            }}
        }}
        """
        )

        self.ATTEMPT_CAPTURE_PAYMENT_MUTATION = (
            lambda id: f"""
        mutation AttemptCapturePayment {{
            attemptCapturePayment(orderId: "{id}") {{
                status
                order {{
                    id
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
        response = self.query(query, user=self.staff_user)
        self.assertResponseNoErrors(response)

        # Fetching content of response
        content = json.loads(response.content)

        # There are two products in the database
        self.assertEqual(len(content["data"]["products"]), 2)

    def test_resolve_retrieve_order_unauthorized(self):
        # Unauthorized user should not be able to retrieve order
        response = self.query(self.RETRIEVE_ORDER_QUERY)
        self.assert_permission_error(response)

    def test_resolve_retrieve_order_authorized(self):
        # Authorized user should be able to retrieve order
        response = self.query(self.RETRIEVE_ORDER_QUERY, user=self.indok_user)
        self.assertResponseNoErrors(response)

    def test_resolve_retrieve_user_orders_unauthorized(self):
        # Unauthorized user should not be able to retrieve orders
        response = self.query(self.RETRIEVE_USER_ORDERS_QUERY)
        self.assert_permission_error(response)

    def test_resolve_retrieve_user_orders_authorized(self):
        # Authorized user should be able to retrieve orders
        response = self.query(self.RETRIEVE_USER_ORDERS_QUERY, user=self.indok_user)
        self.assertResponseNoErrors(response)

        # Fetching content of response
        content = json.loads(response.content)

        # There are three orders in the database
        self.assertEqual(len(content["data"]["userOrders"]), 3)


class EcommerceMutationsTestCase(EcommerceBaseTestCase):
    """
    Testing all mutations for ecommerce
    """

    def test_create_product(self):
        query = """
          mutation {
            createProduct {
                product {
                    id
                    name
                    description
                    price
                    maxBuyableQuantity
                }
                ok
                }
            }
        """
        response = self.query(query, user=self.staff_user)
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

    def test_unauthorized_user_initiate_order(self):
        # Unauthorized user should not be able to initiate order
        response = self.query(self.INITIATE_ORDER_MUTATION(1))
        self.assert_permission_error(response)

    @unittest.mock.patch("apps.ecommerce.mutations.InitiateOrder.vipps_api.get_payment_status")
    @unittest.mock.patch("apps.ecommerce.mutations.InitiateOrder.vipps_api.initiate_payment")
    def test_authorized_user_initiate_order(self, initiate_payment_mock, get_payment_status_mock):
        url = "https://www.youtube.com/watch?v=AWM5ZNdWlqw"
        initiate_payment_mock.return_value = url
        get_payment_status_mock.return_value = ("BlaBla", True)

        # Requesting more than available is not allowed
        response = self.query(self.INITIATE_ORDER_MUTATION(6), user=self.indok_user)
        self.assertResponseHasErrors(response)

        # Requesting more than one user can buy is not allowed
        response = self.query(self.INITIATE_ORDER_MUTATION(3), user=self.indok_user)
        self.assertResponseHasErrors(response)

        # Max is 2 per user so should be allowed to buy this
        response = self.query(self.INITIATE_ORDER_MUTATION(2), user=self.indok_user)
        self.assertResponseNoErrors(response)

        data = json.loads(response.content)["data"]
        redirect_url = data["initiateOrder"]["redirect"]
        self.assertEqual(redirect_url, url)

    def test_unauthenticated_user_attempt_capture_order(self):
        # Unauthenticated user should not be able to initiate order
        response = self.query(self.ATTEMPT_CAPTURE_PAYMENT_MUTATION(self.order_1.id))
        self.assert_permission_error(response)

    def test_unauthorized_user_attempt_capture_order(self):
        # Unauthorized users should not have access to the order
        response = self.query(self.ATTEMPT_CAPTURE_PAYMENT_MUTATION(self.initiated_order.id), user=self.staff_user)
        self.assertResponseHasErrors(response)

    @unittest.mock.patch("apps.ecommerce.mutations.AttemptCapturePayment.vipps_api.capture_payment")
    @unittest.mock.patch("apps.ecommerce.mutations.AttemptCapturePayment.vipps_api.get_payment_status")
    def test_authorized_user_reserve_initiated_order(self, get_payment_status_mock, capture_payment_mock):
        get_payment_status_mock.return_value = ("RESERVE", True)
        response = self.query(self.ATTEMPT_CAPTURE_PAYMENT_MUTATION(self.initiated_order.id), user=self.indok_user)
        data = json.loads(response.content)["data"]
        self.assertResponseNoErrors(response)
        # Reserved orders are immediately tried to captured:
        self.assertEqual(data["attemptCapturePayment"]["status"], "CAPTURED")
        self.assertEqual(capture_payment_mock.call_args.kwargs["method"], "polling")
        self.assertEqual(capture_payment_mock.call_args.args[0].product, self.initiated_order.product)

    @unittest.mock.patch("apps.ecommerce.mutations.AttemptCapturePayment.vipps_api.get_payment_status")
    def test_authorized_user_cancel_initiated_order(self, get_payment_status_mock):
        get_payment_status_mock.return_value = ("CANCEL", True)
        response = self.query(self.ATTEMPT_CAPTURE_PAYMENT_MUTATION(self.initiated_order.id), user=self.indok_user)
        data = json.loads(response.content)["data"]
        self.assertResponseNoErrors(response)
        self.assertEqual(data["attemptCapturePayment"]["status"], "CANCELLED")

    """ @unittest.mock.patch("apps.ecommerce.mutations.AttemptCapturePayment.vipps_api.capture_payment")
    def test_authorized_user_capture_reserved_order(self, capture_payment_mock):
        capture_payment_mock.return_value = ("CANCEL", True)
        response = self.query(self.ATTEMPT_CAPTURE_PAYMENT_MUTATION(self.reserved_order.id), user=self.indok_user)
        data = json.loads(response.content)["data"]
        self.assertResponseNoErrors(response)
        self.assertEqual(data["attemptCapturePayment"]["status"], "CAPTURED")
        print("ARGS: ", capture_payment_mock.call_args.args) """
