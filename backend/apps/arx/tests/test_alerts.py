from datetime import timedelta
from types import SimpleNamespace
from unittest.mock import Mock, patch

from django.db import DatabaseError
from django.test import override_settings
from django.utils import timezone

from apps.arx import alerts
from apps.arx.models import ArxSettings, get_arx_settings
from apps.janhus.models import JanHusBookingSettings
from apps.arx.tests.base import ArxTestCase


class ArxAlertTests(ArxTestCase):
    def _status(self, ok, error=""):
        return self.client.post(
            "/arx-runner/v1/status",
            {"ok": ok, "error": error},
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer tok",
        )

    def _alerts_on(self, **fields):
        """Sync on, the clock from the last good sync only, and a booking contact email."""
        ArxSettings.objects.filter(pk=ArxSettings.SINGLETON_PK).update(
            **{"sync_enabled": True, "sync_enabled_at": None, **fields}
        )
        settings_row = JanHusBookingSettings.objects.first() or JanHusBookingSettings.objects.create()
        settings_row.booking_contact_email = "booking@example.org"
        settings_row.save()

    def test_the_runner_reports_each_sync_and_only_an_error_class_is_kept(self):
        self.assertEqual(self._status(True).status_code, 200)
        cfg = get_arx_settings()
        self.assertIsNotNone(cfg.runner_last_ok_at)
        self.assertEqual(self._status(False, "ArxUnavailable: 10.99.0.2 <b>").status_code, 200)
        self.assertEqual(get_arx_settings().runner_last_error, "ArxUnavailable...b")
        self.assertEqual(get_arx_settings().runner_last_ok_at, cfg.runner_last_ok_at)
        self.assertEqual(self._status("yes").status_code, 400)

    def test_one_mail_after_24_hours_one_more_after_72_then_nothing(self):
        now = timezone.now()
        self._alerts_on(runner_last_ok_at=now, runner_last_error="ArxUnavailable")
        with patch("apps.arx.alerts.TransactionalEmail") as mail:
            self.assertIsNone(alerts.check_runner(now + timedelta(hours=23, minutes=59)))
            self.assertEqual(alerts.check_runner(now + timedelta(hours=24, minutes=1)), alerts.STOPPED)
            self.assertIsNone(alerts.check_runner(now + timedelta(hours=30)))  # told once
            self.assertEqual(alerts.check_runner(now + timedelta(hours=72, minutes=1)), alerts.STILL_STOPPED)
            self.assertIsNone(alerts.check_runner(now + timedelta(days=30)))  # and then no more
            self.assertEqual(mail.call_count, 2)
            first, second = (call.kwargs for call in mail.call_args_list)
            self.assertEqual(first["to"], ["booking@example.org", "kontakt@rubberdok.no"])
            self.assertIn("24 timer", first["subject"])
            self.assertIn("ArxUnavailable", first["body"])
            self.assertNotIn("4321", first["body"])
            self.assertIn("72 timer", second["subject"])
            self.assertIn("siste varsel", second["body"])
        self.assertEqual(get_arx_settings().alert_stage, ArxSettings.AlertStage.AFTER_72_HOURS)

    def test_the_works_again_mail_needs_three_good_syncs_in_a_row_within_24_hours(self):
        start = timezone.now()
        self._alerts_on(runner_last_ok_at=start - timedelta(hours=25))
        with patch("apps.arx.alerts.TransactionalEmail") as mail:
            self.assertEqual(alerts.check_runner(start), alerts.STOPPED)
            alerts.record_runner_status(True, now=start + timedelta(minutes=2))
            alerts.record_runner_status(False, "ArxUnavailable", now=start + timedelta(minutes=4))  # count again
            for minutes in (6, 8):
                alerts.record_runner_status(True, now=start + timedelta(minutes=minutes))
            # more than 24 hours after the first good sync of the count: it starts again
            alerts.record_runner_status(True, now=start + timedelta(hours=25))
            self.assertEqual(mail.call_count, 1)
            self.assertIsNone(alerts.record_runner_status(True, now=start + timedelta(hours=25, minutes=2)))
            recovered = alerts.record_runner_status(True, now=start + timedelta(hours=25, minutes=4))
            self.assertEqual(recovered, alerts.RECOVERED)
            self.assertEqual(mail.call_count, 2)
            self.assertIn("virker igjen", mail.call_args.kwargs["subject"])
            self.assertIsNone(alerts.record_runner_status(True, now=start + timedelta(hours=25, minutes=6)))
            self.assertEqual(mail.call_count, 2)
        cfg = get_arx_settings()
        self.assertEqual(cfg.alert_stage, ArxSettings.AlertStage.NONE)
        self.assertEqual(cfg.recovery_good_syncs, 0)

    def test_no_works_again_mail_without_an_alert_first(self):
        now = timezone.now()
        self._alerts_on(runner_last_ok_at=now - timedelta(hours=2))
        with patch("apps.arx.alerts.TransactionalEmail") as mail:
            for minutes in (0, 2, 4, 6):
                self.assertIsNone(alerts.record_runner_status(True, now=now + timedelta(minutes=minutes)))
        mail.assert_not_called()

    def test_the_clock_starts_when_sync_is_switched_on(self):
        cfg = get_arx_settings()
        cfg.sync_enabled = False
        cfg.save()
        cfg.sync_enabled = True
        cfg.save()
        switched_on = get_arx_settings().sync_enabled_at
        self.assertIsNotNone(switched_on)
        cfg.save()  # saving again while on keeps the time
        self.assertEqual(get_arx_settings().sync_enabled_at, switched_on)
        # a runner that never worked, and one that last worked long before sync was switched on
        for last_ok in (None, switched_on - timedelta(days=5)):
            with self.subTest(last_ok=last_ok):
                self._alerts_on(sync_enabled_at=switched_on, runner_last_ok_at=last_ok, alert_stage=0)
                with patch("apps.arx.alerts.TransactionalEmail") as mail:
                    self.assertIsNone(alerts.check_runner(switched_on + timedelta(hours=23)))
                    self.assertEqual(alerts.check_runner(switched_on + timedelta(hours=24, minutes=1)), alerts.STOPPED)
                    self.assertIn("slått på", mail.call_args.kwargs["body"])

    def test_no_mail_with_sync_off_and_only_rubberdok_without_a_booking_contact(self):
        later = timezone.now() + timedelta(days=2)
        self._alerts_on(runner_last_ok_at=timezone.now(), sync_enabled=False)
        with patch("apps.arx.alerts.TransactionalEmail") as mail:
            self.assertIsNone(alerts.check_runner(later))
            mail.assert_not_called()
            ArxSettings.objects.filter(pk=ArxSettings.SINGLETON_PK).update(sync_enabled=True)
            JanHusBookingSettings.objects.update(booking_contact_email="")
            self.assertEqual(alerts.check_runner(later), alerts.STOPPED)
            self.assertEqual(mail.call_args.kwargs["to"], ["kontakt@rubberdok.no"])

    @override_settings(ARX_STATE_HMAC_KEY="")
    def test_alert_check_is_off_without_the_runner_hmac_key(self):
        self.assertIsNone(alerts.check_runner())

    def test_alert_check_waits_when_there_is_no_sync_timestamp(self):
        self._alerts_on(runner_last_ok_at=None, sync_enabled_at=None)
        self.assertIsNone(alerts.check_runner())

    def test_alert_email_failure_is_logged_without_blocking_the_status_check(self):
        now = timezone.now()
        self._alerts_on(runner_last_ok_at=now - timedelta(hours=25))
        with patch("apps.arx.alerts.TransactionalEmail") as email:
            email.return_value.send.side_effect = RuntimeError("mail unavailable")
            with self.assertLogs("apps.arx.alerts", level="ERROR"):
                self.assertEqual(alerts.check_runner(now), alerts.STOPPED)
        self.assertEqual(get_arx_settings().alert_stage, ArxSettings.AlertStage.AFTER_24_HOURS)

    def test_only_one_process_sends_the_recovery_email(self):
        now = timezone.now()
        rows = Mock()
        rows.first.return_value = SimpleNamespace(
            alert_stage=ArxSettings.AlertStage.AFTER_24_HOURS,
            recovery_started_at=now - timedelta(minutes=4),
            recovery_good_syncs=2,
        )
        rows.exclude.return_value.update.return_value = 0
        with patch("apps.arx.alerts._rows", return_value=rows), patch("apps.arx.alerts.TransactionalEmail") as email:
            self.assertIsNone(alerts.record_runner_status(True, now=now))
        email.assert_not_called()

    def test_traffic_checks_at_most_every_five_minutes_and_a_failure_breaks_nothing(self):
        from apps.arx import middleware

        with patch.object(middleware.time, "monotonic", return_value=1000.0) as clock, patch.object(
            middleware.alerts, "check_runner"
        ) as check:
            handler = middleware.ArxAlertMiddleware(lambda request: "response")
            every = middleware.CHECK_EVERY_SECONDS
            for t in (0, every - 1, every + 1, every + 100, 2 * every + 2):
                clock.return_value = 1000.0 + t
                self.assertEqual(handler(None), "response")
            self.assertEqual(check.call_count, 2)

            check.side_effect = RuntimeError("mail down")
            clock.return_value = 1000.0 + 10 * every
            with self.assertLogs("apps.arx.middleware", level="ERROR"):
                self.assertEqual(handler(None), "response")

            check.side_effect = DatabaseError("database down")
            clock.return_value = 1000.0 + 11 * every
            with self.assertLogs("apps.arx.middleware", level="WARNING"):
                self.assertEqual(handler(None), "response")
