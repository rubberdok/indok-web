import json
import unittest.mock

from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.ecommerce import OrderFactory, ProductFactory
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.factories.users import IndokUserFactory, StaffUserFactory
import decimal

from apps.ecommerce.models import Order, Product


class EcommerceBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.indok_user = IndokUserFactory()
        self.indok_user_2 = IndokUserFactory()
        self.staff_user = StaffUserFactory()
        self.organization = OrganizationFactory()
        MembershipFactory(
            user=self.staff_user,
            organization=self.organization,
            group=self.organization.primary_group,
        )
        self.total_quantity = 5
        self.max_buyable_quantity = 2
        self.product_1 = ProductFactory(
            total_quantity=self.total_quantity, max_buyable_quantity=self.max_buyable_quantity
        )
        self.product_2 = ProductFactory()
        self.order_1 = OrderFactory(product=self.product_1, user=self.indok_user)
        self.initiated_order = OrderFactory(
            product=self.product_2,
            user=self.indok_user,
            payment_status=Order.PaymentStatus.INITIATED,
        )
        self.reserved_order = OrderFactory(
            product=self.product_2,
            user=self.indok_user,
            payment_status=Order.PaymentStatus.RESERVED,
        )

        # Queries used several times:

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
                            timestamp
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
                            timestamp
                    }
                }
                """
        self.INITIATE_ORDER_MUTATION = (
            lambda quantity: f"""
        mutation InitiateOrder {{
            initiateOrder(productId: {self.product_1.id}, quantity: {quantity}) {{
                redirect
            }}
        }}
        """
        )

        self.ATTEMPT_CAPTURE_PAYMENT_MUTATION = (
            lambda order_id: f"""
        mutation AttemptCapturePayment {{
            attemptCapturePayment(orderId: "{order_id}") {{
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
                    timestamp
                }}
            }}
        }}
        """
        )


class EcommerceResolversTestCase(EcommerceBaseTestCase):
    """
    Testing all resolvers for ecommerce-app.
    """

    def test_resolve_products(self) -> None:
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

    def test_resolve_retrieve_order_unauthorized(self) -> None:
        # Unauthorized user should not be able to retrieve order
        response = self.query(self.RETRIEVE_ORDER_QUERY)
        self.assert_permission_error(response)

    def test_resolve_retrieve_order_authorized(self) -> None:
        # Authorized user should be able to retrieve order
        response = self.query(self.RETRIEVE_ORDER_QUERY, user=self.indok_user)
        self.assertResponseNoErrors(response)

    def test_resolve_retrieve_user_orders_unauthorized(self) -> None:
        # Unauthorized user should not be able to retrieve orders
        response = self.query(self.RETRIEVE_USER_ORDERS_QUERY)
        self.assert_permission_error(response)

    def test_resolve_retrieve_user_orders_authorized(self) -> None:
        # Authorized user should be able to retrieve orders
        response = self.query(self.RETRIEVE_USER_ORDERS_QUERY, user=self.indok_user)
        self.assertResponseNoErrors(response)

        # Fetching content of response
        content = json.loads(response.content)

        # There are three orders in the database
        self.assertEqual(len(content["data"]["userOrders"]), 3)


class EcommerceMutationsTestCase(EcommerceBaseTestCase):
    """
    Testing all mutations for ecommerce-app.
    """

    def test_create_product(self) -> None:
        product = ProductFactory.build()
        query = f"""
            mutation CreateProduct {{
                createProduct(
                    productData: {{
                        name: \"{product.name}\",
                        price: \"{product.price}\",
                        description: \"{product.description}\",
                        organizationId: {self.organization.id},
                        totalQuantity: {product.total_quantity},
                        maxBuyableQuantity: {product.max_buyable_quantity},
                        }}
                    ) {{
                product {{
                    id
                    name
                    description
                    price
                    maxBuyableQuantity
                }}
                ok
                    }}
                }}
            """
        response = self.query(query, user=self.staff_user)
        self.assertResponseNoErrors(response)

        data = json.loads(response.content)["data"]
        response_product = data["createProduct"]["product"]
        product = Product.objects.get(pk=response_product["id"])

        self.assertIsNotNone(product, msg="Expected product after creation, got None")
        self.assertTrue(data["createProduct"]["ok"])
        product.price = float(product.price)
        response_product["price"] = float(decimal.Decimal(response_product["price"]))
        self.deep_assert_equal(response_product, product)

    def test_unauthorized_user_initiate_order(self):
        # Unauthorized user should not be able to initiate order
        response = self.query(self.INITIATE_ORDER_MUTATION(1))
        self.assert_permission_error(response)

    @unittest.mock.patch("apps.ecommerce.mutations.InitiateOrder.vipps_api.get_payment_status")
    @unittest.mock.patch("apps.ecommerce.mutations.InitiateOrder.vipps_api.initiate_payment")
    def test_authorized_user_initiate_order(
        self, initiate_payment_mock: unittest.mock.MagicMock, get_payment_status_mock: unittest.mock.MagicMock
    ) -> None:
        url = "https://www.youtube.com/watch?v=AWM5ZNdWlqw"
        initiate_payment_mock.return_value = url
        get_payment_status_mock.return_value = ("BlaBla", True)

        # Scenario 1: Requesting more than available is not allowed
        response = self.query(self.INITIATE_ORDER_MUTATION(self.total_quantity + 1), user=self.indok_user)
        self.assertResponseHasErrors(response)

        # Scenario 2: Requesting more than one user can buy is not allowed
        response = self.query(self.INITIATE_ORDER_MUTATION(self.max_buyable_quantity + 1), user=self.indok_user)
        self.assertResponseHasErrors(response)

        # Max is 2 per user so should be allowed to buy this
        response = self.query(self.INITIATE_ORDER_MUTATION(self.max_buyable_quantity), user=self.indok_user)
        self.assertResponseNoErrors(response)

        data = json.loads(response.content)["data"]
        redirect_url = data["initiateOrder"]["redirect"]
        self.assertEqual(redirect_url, url)

    def test_unauthenticated_user_attempt_capture_order(self) -> None:
        # Unauthenticated user should not be able to capture orders
        response = self.query(self.ATTEMPT_CAPTURE_PAYMENT_MUTATION(self.order_1.id))
        self.assert_permission_error(response)

    def test_unauthorized_user_attempt_capture_order(self) -> None:
        # Unauthorized users should not have access to the order
        response = self.query(self.ATTEMPT_CAPTURE_PAYMENT_MUTATION(self.initiated_order.id), user=self.indok_user_2)
        self.assertResponseHasErrors(response)

    @unittest.mock.patch("apps.ecommerce.mutations.AttemptCapturePayment.vipps_api.capture_payment")
    @unittest.mock.patch("apps.ecommerce.mutations.AttemptCapturePayment.vipps_api.get_payment_status")
    def test_authorized_user_reserve_initiated_order(
        self, get_payment_status_mock: unittest.mock.MagicMock, capture_payment_mock: unittest.mock.MagicMock
    ) -> None:
        get_payment_status_mock.return_value = ("RESERVE", True)
        response = self.query(self.ATTEMPT_CAPTURE_PAYMENT_MUTATION(self.initiated_order.id), user=self.indok_user)
        data = json.loads(response.content)["data"]
        self.assertResponseNoErrors(response)
        # Reserved orders are immediately tried to captured:
        self.assertEqual(data["attemptCapturePayment"]["status"], "CAPTURED")
        self.assertEqual(capture_payment_mock.call_args.kwargs["method"], "polling")
        self.assertEqual(capture_payment_mock.call_args.args[0].product, self.initiated_order.product)

    @unittest.mock.patch("apps.ecommerce.mutations.AttemptCapturePayment.vipps_api.get_payment_status")
    def test_authorized_user_cancel_initiated_order(self, get_payment_status_mock: unittest.mock.MagicMock) -> None:
        get_payment_status_mock.return_value = ("CANCEL", True)
        response = self.query(self.ATTEMPT_CAPTURE_PAYMENT_MUTATION(self.initiated_order.id), user=self.indok_user)
        data = json.loads(response.content)["data"]
        self.assertResponseNoErrors(response)
        self.assertEqual(data["attemptCapturePayment"]["status"], "CANCELLED")
