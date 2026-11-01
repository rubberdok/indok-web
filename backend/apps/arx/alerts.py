"""
Email when the door sync has stopped. Nothing on the backend runs on a schedule, so the
check rides on the runner's status reports and on ordinary traffic (ArxAlertMiddleware,
which also sees the load balancer's health checks).

- 24 hours without a good access sync: one email.
- 72 hours: one more, then nothing until it works again.
- Working again after an email (three good syncs in a row, within 24 hours): one email.

The clock starts at the last good sync, or when sync was switched on if that is later, so
a runner that never reports is noticed too. The emails go to the JanHus booking contact
email and to Rubberdøk. Only error classes and times go in them: no names, card numbers
or PINs.
"""

import logging
import re
from datetime import datetime, timedelta
from typing import Optional

from django.conf import settings
from django.db.models import F
from django.utils import timezone

from apps.janhus.models import JanHusBookingSettings
from utils.mail.streams import TransactionalEmail

from .models import ArxSettings

logger = logging.getLogger(__name__)
ALERT_STREAM = "janhus-booking-confirmations"  # the Postmark stream for JanHus mail; no new stream needed
RUBBERDOK_EMAIL = "kontakt@rubberdok.no"  # always told, whoever runs JanHus
FIRST_ALERT_AFTER = timedelta(hours=24)
LAST_ALERT_AFTER = timedelta(hours=72)
GOOD_SYNCS_TO_RECOVER = 3  # in a row; the runner syncs every 2 minutes
RECOVERY_WINDOW = timedelta(hours=24)
TIME_FORMAT = "%d.%m.%Y kl. %H:%M"
STOPPED, STILL_STOPPED, RECOVERED = "stopped", "still stopped", "recovered"
Stage = ArxSettings.AlertStage


def _rows():
    return ArxSettings.objects.filter(pk=ArxSettings.SINGLETON_PK)


def record_runner_status(ok: bool, error: str = "", now=None) -> Optional[str]:
    """What the runner reported after an access sync. Returns the email sent, if any."""
    now = now or timezone.now()
    rows = _rows()
    if not ok:
        # A failed sync starts the count of good syncs again.
        rows.update(
            runner_last_error=re.sub(r"[^A-Za-z_.]", "", str(error))[:60] or "unknown",
            recovery_good_syncs=0,
            recovery_started_at=None,
        )
        return check_runner(now)

    rows.update(runner_last_ok_at=now, runner_last_error="")
    cfg = rows.first()
    if cfg is None or cfg.alert_stage == Stage.NONE:
        return None
    if cfg.recovery_started_at is None or now - cfg.recovery_started_at > RECOVERY_WINDOW:
        rows.update(recovery_started_at=now, recovery_good_syncs=1)
        good_syncs = 1
    else:
        rows.update(recovery_good_syncs=F("recovery_good_syncs") + 1)
        good_syncs = cfg.recovery_good_syncs + 1
    if good_syncs < GOOD_SYNCS_TO_RECOVER:
        return None
    # one email, however many reports arrive at once
    if rows.exclude(alert_stage=Stage.NONE).update(
        alert_stage=Stage.NONE, recovery_good_syncs=0, recovery_started_at=None
    ):
        _send(cfg, RECOVERED)
        return RECOVERED
    return None


def quiet_since(cfg: ArxSettings) -> Optional[datetime]:
    """The last good sync, or when sync was switched on if that is later."""
    times = [t for t in (cfg.runner_last_ok_at, cfg.sync_enabled_at) if t]
    return max(times) if times else None


def check_runner(now=None) -> Optional[str]:
    """
    STOPPED after 24 hours without a good access sync, STILL_STOPPED after 72. One email
    each, however many server processes check at once. Only while sync is on.
    """
    if not settings.ARX_STATE_HMAC_KEY:
        return None  # the runner API is off
    cfg = _rows().first()
    if cfg is None or not cfg.sync_enabled:
        return None
    since = quiet_since(cfg)
    if since is None:
        return None
    now = now or timezone.now()
    quiet = now - since
    rows = _rows()
    if cfg.alert_stage == Stage.NONE and quiet >= FIRST_ALERT_AFTER:
        if rows.filter(alert_stage=Stage.NONE).update(alert_stage=Stage.AFTER_24_HOURS, alert_sent_at=now):
            _send(cfg, STOPPED, since)
            return STOPPED
    elif cfg.alert_stage == Stage.AFTER_24_HOURS and quiet >= LAST_ALERT_AFTER:
        if rows.filter(alert_stage=Stage.AFTER_24_HOURS).update(alert_stage=Stage.AFTER_72_HOURS, alert_sent_at=now):
            _send(cfg, STILL_STOPPED, since)
            return STILL_STOPPED
    return None


def recipients() -> list:
    """The JanHus booking contact email (JanHus booking settings), if set, and Rubberdøk."""
    contact = (JanHusBookingSettings.objects.values_list("booking_contact_email", flat=True).first() or "").strip()
    if contact and contact.lower() != RUBBERDOK_EMAIL:
        return [contact, RUBBERDOK_EMAIL]
    return [RUBBERDOK_EMAIL]


def _send(cfg: ArxSettings, what: str, since: Optional[datetime] = None) -> None:
    def at(moment):
        return timezone.localtime(moment).strftime(TIME_FORMAT)

    if what == RECOVERED:
        subject = "JanHus-døra: synkroniseringen med ARX virker igjen"
        body = (
            f"Runneren har meldt {GOOD_SYNCS_TO_RECOVER} vellykkede synkroniseringer på rad, "
            f"sist {at(cfg.runner_last_ok_at)}. Du trenger ikke gjøre noe."
        )
    else:
        hours = 24 if what == STOPPED else 72
        if since == cfg.runner_last_ok_at:
            started = f"siden {at(since)}"
        else:
            started = f"siden synkroniseringen ble slått på {at(since)}"
        later = (
            "Virker den ikke igjen innen 72 timer, kommer én e-post til."
            if what == STOPPED
            else "Dette er siste varsel."
        )
        subject = f"JanHus-døra: synkroniseringen med ARX har stått i {hours} timer"
        body = (
            f"Runneren på JanHus har ikke meldt en vellykket synkronisering {started}.\n"
            f"Siste feil runneren meldte: {cfg.runner_last_error or 'ingen (den har ikke svart)'}.\n\n"
            "Døra virker fortsatt med tilgangene som allerede ligger i ARX. Nye bookinger, kort og PIN-er "
            "kommer ikke fram før synkroniseringen virker igjen.\n\n"
            "Hva du gjør: flytskjemaet «When the runner goes silent», og manage.py arx_sync --status.\n"
            f"{later} Dere får en e-post når den virker igjen."
        )
    email = TransactionalEmail(stream=ALERT_STREAM, subject=subject, body=body, to=recipients())
    try:
        email.send()
    except Exception:
        logger.exception("Could not send the ARX alert email")
