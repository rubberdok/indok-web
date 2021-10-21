from locust import HttpUser, task, between


class TestUser(HttpUser):
    wait_time = between(0.1, 0.2)

    @task
    def buy_product(self):
        self.client.get("/")

    def on_start(self):
        response = self.client.get("/admin/login/")
        csrftoken = response.cookies["csrftoken"]
        print("hello", csrftoken)

        self.client.post(
            "/admin/login/",
            {"username": "admin", "password": "admin123"},
            headers={"X-CSRFToken": csrftoken},
        )
