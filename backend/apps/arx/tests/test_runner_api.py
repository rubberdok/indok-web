import json

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.core.exceptions import ValidationError as DjangoValidationError
from django.test import Client, override_settings
from django.urls import reverse

from apps.arx import views
from apps.arx.models import ArxAreaMapping, ArxSettings, get_arx_settings
from apps.arx.tests.base import ArxTestCase

User = get_user_model()


class ArxRunnerApiTests(ArxTestCase):
    @override_settings(ARX_STATE_HMAC_KEY="")
    def test_without_the_hmac_key_the_runner_api_is_off(self):
        response = self.client.get("/arx-runner/v1/work", HTTP_AUTHORIZATION="Bearer tok")
        self.assertEqual(response.status_code, 503)

    def test_view_requires_token(self):
        self.assertEqual(self.client.get("/arx-runner/v1/work").status_code, 401)
        self.assertEqual(self.client.get("/arx-runner/v1/work", HTTP_AUTHORIZATION="Bearer nope").status_code, 401)
        ok = self.client.get("/arx-runner/v1/work", HTTP_AUTHORIZATION="Bearer tok")
        self.assertEqual(ok.status_code, 200)
        self.assertEqual(ok["Cache-Control"], "no-store")

    def test_machine_runner_post_uses_token_instead_of_csrf(self):
        client = Client(enforce_csrf_checks=True)
        payload = json.dumps({"ok": True})
        self.assertEqual(
            client.post("/arx-runner/v1/status", payload, content_type="application/json").status_code,
            401,
        )
        response = client.post(
            "/arx-runner/v1/status",
            payload,
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer tok",
        )
        self.assertEqual(response.status_code, 200)

    def test_runner_endpoints_validate_payloads_and_accept_empty_batches(self):
        cases = (
            ("/arx-runner/v1/results", b"\xff"),
            ("/arx-runner/v1/results", json.dumps({"results": "not a list"})),
            ("/arx-runner/v1/status", json.dumps({"ok": "true"})),
            ("/arx-runner/v1/events", json.dumps({"events": "not a list"})),
            ("/arx-runner/v1/events", json.dumps({"events": [], "new_cursor_ms": "invalid"})),
        )
        for path, body in cases:
            with self.subTest(path=path, body=body):
                response = self.client.post(
                    path,
                    body,
                    content_type="application/json",
                    HTTP_AUTHORIZATION="Bearer tok",
                )
                self.assertEqual(response.status_code, 400)

        results = self.client.post(
            "/arx-runner/v1/results",
            json.dumps({"results": []}),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer tok",
        )
        events = self.client.post(
            "/arx-runner/v1/events",
            json.dumps({"events": [], "new_cursor_ms": 1}),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer tok",
        )
        cursor = self.client.get("/arx-runner/v1/event-cursor", HTTP_AUTHORIZATION="Bearer tok")
        self.assertEqual(results.status_code, 200)
        self.assertEqual(events.status_code, 200)
        self.assertEqual(cursor.status_code, 200)

    def test_runner_rejects_oversized_request_bodies(self):
        response = self.client.post(
            "/arx-runner/v1/results",
            b"x" * (views.MAX_BODY_BYTES + 1),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer tok",
        )
        self.assertEqual(response.status_code, 413)

    def test_polling_survives_an_invalid_unrelated_setting(self):
        ArxSettings.objects.filter(pk=ArxSettings.SINGLETON_PK).update(horizon_days=0)  # fails full_clean
        response = self.client.get("/arx-runner/v1/work", HTTP_AUTHORIZATION="Bearer tok")
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(get_arx_settings().runner_last_seen_at)

    def test_view_logs_do_not_contain_pin(self):
        with self.assertLogs("apps.arx", level="INFO") as logs:
            self.client.get("/arx-runner/v1/work", HTTP_AUTHORIZATION="Bearer tok")
        self.assertNotIn("4321", " ".join(logs.output))

    def test_runner_allowlist_from_settings(self):
        cfg = get_arx_settings()
        cases = (
            ("", False, {}, 200),  # empty: no address check
            ("203.0.113.0/29", False, {}, 403),  # the test client calls from 127.0.0.1
            ("127.0.0.1", False, {}, 200),
            # behind the load balancer the LAST X-Forwarded-For entry counts, never the first
            ("203.0.113.7", True, {"HTTP_X_FORWARDED_FOR": "203.0.113.7, 198.51.100.9"}, 403),
            ("203.0.113.7", True, {"HTTP_X_FORWARDED_FOR": "198.51.100.9, 203.0.113.7"}, 200),
            ("203.0.113.7", True, {"HTTP_X_FORWARDED_FOR": "not-an-ip"}, 403),
            ("203.0.113.7", False, {"HTTP_X_FORWARDED_FOR": "198.51.100.9, 203.0.113.7"}, 403),
        )
        for allowed, trust, headers, status in cases:
            with self.subTest(allowed=allowed, trust=trust, headers=headers):
                cfg.runner_allowed_ips, cfg.trust_x_forwarded_for = allowed, trust
                cfg.save()
                response = self.client.get("/arx-runner/v1/work", HTTP_AUTHORIZATION="Bearer tok", **headers)
                self.assertEqual(response.status_code, status)

    def test_invalid_allowlist_is_refused_on_save_and_fails_closed_if_stored(self):
        cfg = get_arx_settings()
        cfg.runner_allowed_ips = "not-an-ip"
        with self.assertRaises(DjangoValidationError):
            cfg.save()
        ArxSettings.objects.filter(pk=ArxSettings.SINGLETON_PK).update(runner_allowed_ips="not-an-ip")
        self.assertEqual(self.client.get("/arx-runner/v1/work", HTTP_AUTHORIZATION="Bearer tok").status_code, 403)

    def test_only_superusers_change_settings_and_area_mappings(self):
        staff = User.objects.create(username="staff2", is_staff=True)
        staff.user_permissions.add(*Permission.objects.filter(content_type__app_label="arx"))
        self.client.force_login(staff)
        url = reverse("admin:arx_arxsettings_change", args=[ArxSettings.SINGLETON_PK])
        self.client.post(url, {"sync_enabled": "", "runner_allowed_ips": "198.51.100.1"})
        self.assertEqual(get_arx_settings().runner_allowed_ips, "")  # all model permissions are not enough
        mapping = ArxAreaMapping.objects.get()
        self.assertEqual(
            self.client.post(
                reverse("admin:arx_arxareamapping_delete", args=[mapping.pk]), {"post": "yes"}
            ).status_code,
            403,
        )
        self.assertTrue(ArxAreaMapping.objects.filter(pk=mapping.pk).exists())
