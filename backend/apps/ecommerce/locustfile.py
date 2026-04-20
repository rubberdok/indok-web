from locust import HttpUser, between, task
import json


class WebsiteUser(HttpUser):
    wait_time = between(0.5, 1)

    def on_start(self):
        self.client.post(
            "/graphql/", data=json.dumps({"query": "query {authToken}"}), headers={"content-type": "application/json"}
        )

    @task
    def initiate_order(self):
        query = (
            lambda product_id, q: f"""
        mutation InitiateOrder {{
            initiateOrder(productId: {product_id}, quantity: {q}) {{
                redirect
            }}
        }}
        """
        )

        self.client.post(
            "/graphql/", data=json.dumps({"query": query(1, 1)}), headers={"content-type": "application/json"}
        )
