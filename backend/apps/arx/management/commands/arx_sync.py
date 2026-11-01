"""
`arx_sync` on the backend only reports and housekeeps; the runner at JanHus does
the actual push (the backend has no ARX credentials and no route to ARX).

  manage.py arx_sync --status    counts per status, card conflicts, runner heartbeat and last good sync
  manage.py arx_sync --dry-run   how many persons would be sent (no PINs printed)
  manage.py arx_sync --prune     delete ARX door events past the retention setting
Exit code 2 from --status means the runner has not polled for > --max-silence minutes.
"""

import sys
from collections import Counter
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.arx import alerts, services
from apps.arx.models import ArxPersonSync, get_arx_settings


class Command(BaseCommand):
    help = "ARX integration status and housekeeping (the runner performs the sync)."

    def add_arguments(self, parser):
        parser.add_argument("--status", action="store_true")
        parser.add_argument("--dry-run", action="store_true")
        parser.add_argument("--prune", action="store_true")
        parser.add_argument("--max-silence", type=int, default=15, help="minutes")

    def handle(self, *args, **opts):
        cfg = get_arx_settings()
        if opts["prune"]:
            self.stdout.write(f"pruned {services.prune_events()} events (retention {cfg.event_retention_days} d)")
        if opts["dry_run"]:
            # read-only: pending_work() would create rows and record issued hashes
            synced = dict(ArxPersonSync.objects.values_list("external_id", "synced_hash"))
            pending = sum(
                1
                for ext, state in services.compute_desired_states(cfg=cfg).items()
                if (ext in synced or state.windows) and synced.get(ext) != state.digest()
            )
            self.stdout.write(f"would send {pending} persons (sync_enabled={cfg.sync_enabled})")
        if opts["status"]:
            counts = Counter(ArxPersonSync.objects.values_list("status", flat=True))
            self.stdout.write(f"statuses: {dict(counts)}")
            waiting = ArxPersonSync.objects.exclude(conflict_arx_person_id="").count()
            self.stdout.write(f"card conflicts waiting for approval in Django admin: {waiting}")
            if cfg.card_digits_warning:
                self.stdout.write(f"card number warning ({cfg.card_digits_warning_at}): {cfg.card_digits_warning}")
            seen = cfg.runner_last_seen_at
            stale = seen is None or timezone.now() - seen > timedelta(minutes=opts["max_silence"])
            self.stdout.write(f"runner last seen: {seen}")
            self.stdout.write(f"last good access sync: {cfg.runner_last_ok_at}")
            if cfg.runner_last_error:
                self.stdout.write(f"last error the runner reported: {cfg.runner_last_error}")
            self.stdout.write(
                f"alert emails to {', '.join(alerts.recipients())}: {cfg.get_alert_stage_display()}"
                + (f", {cfg.alert_sent_at}" if cfg.alert_stage else "")
            )
            if cfg.sync_enabled and stale:
                self.stderr.write("runner silent")
                sys.exit(2)
