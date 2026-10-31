"""
Machine API used only by the JanHus runner. Not part of the GraphQL schema and
never called by the browser or the Next.js frontend.

Auth: `Authorization: Bearer <token>`. Only SHA-256 hashes of valid tokens are
configured (ARX_RUNNER_TOKEN_SHA256S, comma separated: current + next during
rotation). Responses carry PINs, so they are never cached or logged.
"""

import hashlib
import hmac
import ipaddress
import json
import logging
from functools import wraps

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from . import alerts, services
from .models import ArxSettings, get_arx_settings

logger = logging.getLogger(__name__)
MAX_BODY_BYTES = 512 * 1024


def _token_ok(request) -> bool:
    header = request.META.get("HTTP_AUTHORIZATION", "")
    if not header.startswith("Bearer "):
        return False
    presented = hashlib.sha256(header[7:].strip().encode()).hexdigest()
    return any(hmac.compare_digest(presented, valid) for valid in settings.ARX_RUNNER_TOKEN_SHA256S)


def _client_ip(request, trust_forwarded_for: bool) -> str:
    """
    The caller's address. Behind the AWS load balancer the real address is the
    LAST entry of X-Forwarded-For (the balancer appends it); earlier entries are
    whatever the caller sent and cannot be trusted.
    """
    if trust_forwarded_for:
        forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
        if forwarded:
            return forwarded.split(",")[-1].strip()
    return request.META.get("REMOTE_ADDR", "")


def _ip_allowed(request, cfg) -> bool:
    """ArxSettings.runner_allowed_ips, set by a superuser in Django admin. Empty = any address."""
    try:
        networks = cfg.runner_networks()
    except ValueError:  # saved without validation: refuse rather than guess
        logger.error("ArxSettings.runner_allowed_ips is not valid; refusing runner calls")
        return False
    if not networks:
        return True
    try:
        address = ipaddress.ip_address(_client_ip(request, cfg.trust_x_forwarded_for))
    except ValueError:
        return False
    return any(address in network for network in networks)


def runner_auth(view):
    # A machine API: only the bearer token and IP allowlist count, never browser cookies.
    # See test_machine_runner_post_uses_token_instead_of_csrf.
    @csrf_exempt  # NOSONAR
    @wraps(view)
    def wrapper(request, *args, **kwargs):
        if not _ip_allowed(request, get_arx_settings()):
            logger.warning("ARX runner call from an address not on the allowlist")
            return HttpResponse(status=403)
        if not settings.ARX_RUNNER_TOKEN_SHA256S or not _token_ok(request):
            logger.warning("ARX runner auth failed")  # never log the presented token
            return HttpResponse(status=401)
        if not settings.ARX_STATE_HMAC_KEY:
            logger.error("ARX_STATE_HMAC_KEY is not set; the runner API is off")
            return HttpResponse(status=503)
        if len(request.body or b"") > MAX_BODY_BYTES:
            return HttpResponse(status=413)
        response = view(request, *args, **kwargs)
        response["Cache-Control"] = "no-store"
        return response

    return wrapper


def _json_body(request):
    try:
        data = json.loads(request.body or b"{}")
    except ValueError:
        return None
    return data if isinstance(data, dict) else None


@runner_auth
@require_GET
def work(request):
    cfg = get_arx_settings()
    # One UPDATE, no full_clean(): an unrelated invalid setting must not stop the polling
    ArxSettings.objects.filter(pk=ArxSettings.SINGLETON_PK).update(runner_last_seen_at=timezone.now())
    items = services.pending_work()
    logger.info("ARX runner fetched %d work items", len(items))  # count only
    return JsonResponse({"enabled": cfg.sync_enabled, "items": items})


@runner_auth
@require_POST
def results(request):
    data = _json_body(request)
    if data is None or not isinstance(data.get("results"), list):
        return HttpResponse(status=400)
    updated = services.record_results(data["results"])
    return JsonResponse({"updated": updated})


@runner_auth
@require_POST
def status(request):
    """How the last access sync went: {"ok": bool, "error": error class or ""}. Drives the alert email."""
    data = _json_body(request)
    if data is None or not isinstance(data.get("ok"), bool):
        return HttpResponse(status=400)
    alerts.record_runner_status(data["ok"], str(data.get("error", "")))
    return JsonResponse({"recorded": True})


@runner_auth
@require_GET
def event_cursor(request):
    return JsonResponse({"since_ms": services.get_cursor().last_timestamp_ms})


@runner_auth
@require_POST
def events(request):
    data = _json_body(request)
    if data is None or not isinstance(data.get("events"), list):
        return HttpResponse(status=400)
    try:
        new_cursor = int(data.get("new_cursor_ms", 0))
    except (TypeError, ValueError):
        return HttpResponse(status=400)
    return JsonResponse(services.ingest_events(data["events"], new_cursor))
