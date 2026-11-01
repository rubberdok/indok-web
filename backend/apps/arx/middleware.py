import logging
import time

from django.db import DatabaseError

from . import alerts

logger = logging.getLogger(__name__)
CHECK_EVERY_SECONDS = 300


class ArxAlertMiddleware:
    """
    Asks apps.arx.alerts whether the door sync has gone quiet, at most every five minutes
    per server process, the first time five minutes after the process starts. It runs after
    the response is ready and never breaks a request. First in MIDDLEWARE, so the load
    balancer's health checks drive it even when nobody uses the site.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.next_check = time.monotonic() + CHECK_EVERY_SECONDS

    def __call__(self, request):
        response = self.get_response(request)
        now = time.monotonic()
        if now >= self.next_check:
            self.next_check = now + CHECK_EVERY_SECONDS
            try:
                alerts.check_runner()
            except DatabaseError:
                logger.warning("ARX alert check skipped: database not ready")  # e.g. migrations pending
            except Exception:
                logger.exception("ARX alert check failed")
        return response
