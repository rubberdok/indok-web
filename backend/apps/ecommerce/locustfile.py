from locust import HttpUser, between, task
import json


class WebsiteUser(HttpUser):
    wait_time = between(0.5, 1)

    @staticmethod
    def _initiate_order_query(product_id, quantity):
        return f"""
        mutation InitiateOrder {{
            initiateOrder(productId: {product_id}, quantity: {quantity}) {{
                redirect
            }}
        }}
        """

    def on_start(self):
        self.client.post(
            "/graphql/", data=json.dumps({"query": "query {authToken}"}), headers={"content-type": "application/json"}
        )

    @task
    def initiate_order(self):
        self.client.post(
            "/graphql/",
            data=json.dumps({"query": self._initiate_order_query(1, 1)}),
            headers={"content-type": "application/json"},
        )
