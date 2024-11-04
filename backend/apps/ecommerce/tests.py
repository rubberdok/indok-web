import decimal
import json
from datetime import datetime, timedelta
from typing import Optional, TypedDict, Union
from unittest.mock import MagicMock, patch

import requests
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.ecommerce import OrderFactory, ProductFactory
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.factories.users import IndokUserFactory, StaffUserFactory

from apps.ecommerce.models import Order, Product


class TransactionLogEntry(TypedDict):
    operation: str
    operationSuccess: str


class GetPaymentStatus(TypedDict):
    transactionLogHistory: list[TransactionLogEntry]


class CapturePayment(TypedDict):
    stauts: str


class InitiatePayment(TypedDict):
    url: str


class CancelTransaction(TypedDict):
    status: str


class AccessToken(TypedDict):
    access_token: str
    expires_on: float


class MockResponse:
    def __init__(
        self,
        json_data: Union[GetPaymentStatus, CapturePayment, InitiatePayment, CancelTransaction, AccessToken],
        status_code: int,
    ) -> None:
        self.json_data = json_data
        self.status_code = status_code

    def json(self):
        return self.json_data

    def raise_for_status(self):
        if self.status_code in range(400, 600):
            raise requests.exceptions.RequestException("error")


def setup_mock_get(
    get_payment_status: MockResponse = MockResponse(
        {"transactionLogHistory": [{"operation": "INITIATE", "operationSuccess": "SUCCESS"}]}, 200
    ),
):
    def mock_get(*args, **kwargs):
        if args[0].endswith("/details"):
            return get_payment_status

    return mock_get


def setup_mock_post(
    access_token: MockResponse = MockResponse(
        {"access_token": "test_access_token", "expires_on": (datetime.now() + timedelta(days=1)).timestamp()}, 200
    ),
    capture_payment: MockResponse = MockResponse({"status": "SUCCESS"}, 200),
    initiate_payment: MockResponse = MockResponse({"url": "https://www.example.com"}, 200),
):
    def mock_post(*args, **kwargs):
        if args[0].endswith("/accessToken/get"):
            return access_token

        if args[0].endswith("/capture"):
            return capture_payment

        if args[0].endswith("/payments"):
            return initiate_payment

    return mock_post


def setup_mock_put(cancel_transaction: MockResponse = MockResponse({"status": "SUCCESS"}, 200)):
    def mock_put(*args, **kwargs):
        if args[0].endswith("/cancel"):
            return cancel_transaction

    return mock_put


PAYMENT_STATUS_PATH = lambda mutation: f"apps.ecommerce.mutations.{mutation}.vipps_api.get_payment_status"  # noqa
CANCEL_TRANSACTION_PATH = "apps.ecommerce.mutations.InitiateOrder.vipps_api.cancel_transaction"
INITIATE_PAYMENT_PATH = "apps.ecommerce.mutations.InitiateOrder.vipps_api.initiate_payment"
CAPTURE_PAYMENT_PATH = "apps.ecommerce.mutations.AttemptCapturePayment.vipps_api.capture_payment"


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
        self.initiated_order = OrderFactory(
            product=self.product_2,
            user=self.indok_user,
            payment_status=Order.PaymentStatus.INITIATED,
        )

        # Queries used several times:

        self.RETRIEVE_ORDER_QUERY = f"""
                query Order{{
                        order(orderId: "{self.initiated_order.id}") {{
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

        # There is one order in the database
        self.assertEqual(len(content["data"]["userOrders"]), 1)


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

    @patch("requests.get", side_effect=setup_mock_get())
    @patch("requests.post", side_effect=setup_mock_post())
    @patch("requests.put", side_effect=setup_mock_put())

    def test_authorized_user_initiate_order(self, *args, **kwargs) -> None:
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
        self.assertEqual(redirect_url, "https://www.example.com")

    @patch("requests.get", side_effect=setup_mock_get())
    @patch("requests.post", side_effect=setup_mock_post())
    @patch("requests.put", side_effect=setup_mock_put())
    def test_initate_after_reserved_callback(self, *args, **kwargs):
        unique_user = IndokUserFactory()
        response = self.query(self.INITIATE_ORDER_MUTATION(self.max_buyable_quantity), user=unique_user)
        self.assertResponseNoErrors(response)
        order: Order = Order.objects.get(user=unique_user)
        # callback from Vipps sets the order to RESERVED
        order.payment_status = order.PaymentStatus.RESERVED
        order.save()

        response = self.query(self.INITIATE_ORDER_MUTATION(self.max_buyable_quantity), user=unique_user)
        self.assertResponseHasErrors(response)

    @patch(
        "requests.get",
        side_effect=setup_mock_get(
            get_payment_status=MockResponse(
                {"transactionLogHistory": [{"operation": "INITIATE", "operationSuccess": "SUCCESS"}]}, 200
            )
        ),
    )
    @patch("requests.post", side_effect=setup_mock_post())
    @patch("requests.put", side_effect=setup_mock_put())
    def test_cancel_initiated_orders_on_reattempt(self, mock_put: MagicMock, *args, **kwargs):
        unique_user = IndokUserFactory()
        self.query(self.INITIATE_ORDER_MUTATION(self.max_buyable_quantity), user=unique_user)
        self.query(self.INITIATE_ORDER_MUTATION(self.max_buyable_quantity), user=unique_user)
        order: Order = Order.objects.get(user=unique_user, product=self.product_1)
        # Ensure that the previous payment attempt is cancelled
        self.assertTrue(mock_put.call_args.args[0].endswith(f"{order.id}-{order.payment_attempt - 1}/cancel"))

    @patch("requests.get", side_effect=setup_mock_get())
    @patch("requests.post", side_effect=setup_mock_post(initiate_payment=MockResponse({"url": "test"}, 500)))
    @patch("requests.put", side_effect=setup_mock_put())
    def test_handle_vipps_errors_on_initiate(self, *args, **kwargs):
        unique_user = IndokUserFactory()
        prev_quantity = self.product_1.current_quantity
        self.query(self.INITIATE_ORDER_MUTATION(self.max_buyable_quantity), user=unique_user)
        product: Product = Product.objects.get(pk=self.product_1.id)
        self.assertEqual(prev_quantity, product.current_quantity)
        self.assertFalse(Order.objects.filter(user=unique_user).exists())

    @patch(
        "requests.get",
        side_effect=setup_mock_get(
            get_payment_status=MockResponse(
                {"transactionLogHistory": [{"operation": "RESERVE", "operationSuccess": "SUCCESS"}]}, 200
            )
        ),
    )
    @patch("requests.put", side_effect=setup_mock_put())
    @patch("requests.post", side_effect=setup_mock_post(capture_payment=MockResponse({"status": "SUCCESS"}, 200)))
    def do_attempt_capture_order_test(
        self,
        post_mock: MagicMock,
        *args,
        user: Optional[IndokUserFactory] = None,
        **kwargs,
    ):
        """
        If an order is INITIATED in the DB and Vipps status returns RESERVE, it should be captured and set to CAPTURED.
        """
        response = self.query(self.ATTEMPT_CAPTURE_PAYMENT_MUTATION(self.initiated_order.id), user=user)
        data = json.loads(response.content)["data"]
        self.assertResponseNoErrors(response)
        # Reserved orders are immediately tried to captured:
        self.assertEqual(data["attemptCapturePayment"]["status"], "CAPTURED")
        self.assertTrue(
            post_mock.call_args.args[0].endswith(
                f"{self.initiated_order.id}-{self.initiated_order.payment_attempt}/capture"
            )
        )

    def test_unauthenticated_user_attempt_capture_order(self) -> None:
        # Unauthenticated users should be able to capture orders
        self.do_attempt_capture_order_test(user=None)

    def test_unauthorized_user_attempt_capture_order(self) -> None:
        # Unauthorized users should be able to capture orders
        self.do_attempt_capture_order_test(user=self.indok_user_2)

    def test_authorized_user_reserve_initiated_order(self) -> None:
        # Authorized users should be able to capture orders
        self.do_attempt_capture_order_test(user=self.indok_user)

    @patch(
        "requests.get",
        side_effect=setup_mock_get(
            get_payment_status=MockResponse(
                {"transactionLogHistory": [{"operation": "CANCEL", "operationSuccess": "SUCCESS"}]}, 200
            )
        ),
    )
    @patch("requests.post", side_effect=setup_mock_post(capture_payment=MockResponse({"status": "SUCCESS"}, 200)))
    @patch("requests.put", side_effect=setup_mock_put())
    def do_attempt_capture_cancelled_order_test(self, *args, user: Optional[IndokUserFactory] = None, **kwargs):
        # If an order is INITIATED in the DB and Vipps status returns CANCEL, it should be set to CANCELLED in the DB
        response = self.query(self.ATTEMPT_CAPTURE_PAYMENT_MUTATION(self.initiated_order.id), user=user)
        data = json.loads(response.content)["data"]
        self.assertResponseNoErrors(response)
        self.assertEqual(data["attemptCapturePayment"]["status"], "CANCELLED")

    def test_unauthenticated_user_attempt_capture_cancelled_order(self) -> None:
        # Unauthenticated users should be able to update cancelled orders from INITIATED -> CANCELLED
        self.do_attempt_capture_cancelled_order_test(user=None)

    def test_unauthorized_user_attempt_capture_cancelled_order(self) -> None:
        # Unauthorized users should be able to update cancelled orders from INITIATED -> CANCELLED
        self.do_attempt_capture_cancelled_order_test(user=self.indok_user_2)

    def test_authorized_user_attempt_capture_cancelled_order(self) -> None:
        # Authorized users should be able to update cancelled orders from INITIATED -> CANCELLED
        self.do_attempt_capture_cancelled_order_test(user=self.indok_user)

    def test_delivered_product(self) -> None:
        unique_user = IndokUserFactory()
        order = OrderFactory(product=self.product_1, user=unique_user)

        orderId = order.id
        query = f"""
            mutation deliveredProduct {{
                deliveredProduct(
                    orderId: "{orderId}",
                ) {{
                ok
                    }}
                }}
            """

        response = self.query(query, user=self.staff_user)
        self.assertResponseNoErrors(response)

        response = self.query(query, user=unique_user)
        self.assert_permission_error(response)

        order = Order.objects.get(pk=order.id)
        self.assertTrue(order.delivered_product)


class PaginatedShopOrdersResolverTests(ExtendedGraphQLTestCase):
    def setUp(self):
        # Create a staff user using the StaffUserFactory
        self.staff_user = StaffUserFactory(username='staffuser')

        # Ensure the user satisfies the requirements for the new decorators
        self.staff_user.is_staff = True  # Required for @staff_member_required
        self.staff_user.is_superuser = True  # Required for @superuser_required if added
        self.staff_user.save()

        # Create a product with `shop_item=True` to pass the resolver's filter condition
        self.product = ProductFactory(
            name='Test Product',
            price=decimal.Decimal('1000.00'),
            description='A test product description',
            max_buyable_quantity=2,
            total_quantity=5,
            shop_item=True  # Ensure this matches the resolver's filter condition
        )

        # Create multiple orders associated with the product and user
        self.orders = [
            OrderFactory(
                product=self.product,
                user=self.staff_user,
                payment_status=Order.PaymentStatus.INITIATED,
            )
            for i in range(10)
        ]

    def test_paginated_shop_orders_with_fragment_and_product(self):
        query = '''
        query paginatedShopOrders($limit: Int, $offset: Int) {
          paginatedShopOrders(limit: $limit, offset: $offset) {
            ...Order
          }
        }

        fragment Order on OrderType {
          id
          quantity
          totalPrice
          paymentStatus
          timestamp
          deliveredProduct
          product {
            ...Product
          }
        }

        fragment Product on ProductType {
          id
          name
          price
          description
          maxBuyableQuantity
          shopItem
        }
        '''

        # Execute the query using the query method from ExtendedGraphQLTestCase
        response = self.query(query, variables={"limit": 5, "offset": 2}, user=self.staff_user)  # Use staff user
        data = json.loads(response.content)

        # Check if the response data matches expectations
        self.assertIn('data', data)
        self.assertIn('paginatedShopOrders', data['data'])
        self.assertEqual(len(data['data']['paginatedShopOrders']), 5)

        # Verify the structure of the nested product field in the first order
        first_order = data['data']['paginatedShopOrders'][0]
        self.assertIn('product', first_order)
        self.assertEqual(first_order['product']['name'], 'Test Product')
        self.assertEqual(first_order['product']['price'], '1000.00')  # Adjusted for consistency
        self.assertTrue(first_order['product']['shopItem'])

        # Additional checks for other fields
        self.assertIn('quantity', first_order)
        self.assertIn('paymentStatus', first_order)
        self.assertIn('timestamp', first_order)
