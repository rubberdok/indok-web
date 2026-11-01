# Written by hand to match apps/arx/models.py (no Django environment was available).
# `python manage.py makemigrations arx --check --dry-run` must report no changes.

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("janhus", "0022_door_access_fields"),
        ("nfc", "0007_card_number_and_cleanup"),
    ]

    operations = [
        migrations.CreateModel(
            name="ArxSettings",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "sync_enabled",
                    models.BooleanField(default=False, help_text="Kill switch. When off the runner receives no work."),
                ),
                (
                    "buffer_before_minutes",
                    models.PositiveIntegerField(
                        default=60, validators=[django.core.validators.MaxValueValidator(1440)]
                    ),
                ),
                (
                    "buffer_after_minutes",
                    models.PositiveIntegerField(
                        default=60, validators=[django.core.validators.MaxValueValidator(1440)]
                    ),
                ),
                (
                    "horizon_days",
                    models.PositiveIntegerField(
                        default=7,
                        help_text="Only bookings starting within this many days are pushed to ARX.",
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(60),
                        ],
                    ),
                ),
                (
                    "event_retention_days",
                    models.PositiveIntegerField(
                        default=60,
                        help_text="Door events imported from ARX are deleted after this many days.",
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(365),
                        ],
                    ),
                ),
                (
                    "card_format_classic",
                    models.CharField(
                        default="Mifare CSN",
                        help_text="ARX format for 4-byte MIFARE cards (template 'Mifare serial number').",
                        max_length=100,
                    ),
                ),
                (
                    "card_format_desfire",
                    models.CharField(
                        default="DESFire CSN",
                        help_text="ARX format for 7-byte DESFire cards (template 'DESFire CSN Template').",
                        max_length=100,
                    ),
                ),
                (
                    "card_number_digits",
                    models.PositiveSmallIntegerField(
                        default=0,
                        help_text=(
                            "0 = send the whole 32-bit number, as the Mifare CSN and DESFire CSN formats use it. "
                            "Set N only for a format that keeps just the last N digits (the 'External' format "
                            "kept 9)."
                        ),
                        validators=[django.core.validators.MaxValueValidator(10)],
                    ),
                ),
                (
                    "runner_allowed_ips",
                    models.TextField(
                        blank=True,
                        default="",
                        help_text=(
                            "Addresses or networks the JanHus runner calls from, one per line or comma separated, "
                            "for example 203.0.113.7 or 203.0.113.0/29. Empty = no address check (the runner's "
                            "token is still required). Update it before changing internet provider."
                        ),
                    ),
                ),
                (
                    "trust_x_forwarded_for",
                    models.BooleanField(
                        default=False,
                        help_text=(
                            "On only while the backend sits behind the AWS load balancer: the caller's address is "
                            "then the last X-Forwarded-For entry. Off: the direct connection's address is used."
                        ),
                    ),
                ),
                ("sync_enabled_at", models.DateTimeField(blank=True, editable=False, null=True)),
                ("runner_last_seen_at", models.DateTimeField(blank=True, editable=False, null=True)),
                ("runner_last_ok_at", models.DateTimeField(blank=True, editable=False, null=True)),
                ("runner_last_error", models.CharField(blank=True, default="", editable=False, max_length=60)),
                (
                    "alert_stage",
                    models.PositiveSmallIntegerField(
                        choices=[
                            (0, "No email sent"),
                            (1, "Sent after 24 hours without a good sync"),
                            (2, "Sent again after 72 hours (the last one)"),
                        ],
                        default=0,
                        editable=False,
                    ),
                ),
                ("alert_sent_at", models.DateTimeField(blank=True, editable=False, null=True)),
                ("recovery_good_syncs", models.PositiveSmallIntegerField(default=0, editable=False)),
                ("recovery_started_at", models.DateTimeField(blank=True, editable=False, null=True)),
                ("card_digits_warning", models.CharField(blank=True, default="", editable=False, max_length=200)),
                ("card_digits_warning_at", models.DateTimeField(blank=True, editable=False, null=True)),
            ],
            options={
                "verbose_name": "ARX settings",
                "verbose_name_plural": "ARX settings",
            },
        ),
        migrations.CreateModel(
            name="ArxEventCursor",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("last_timestamp_ms", models.BigIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name="ArxAreaMapping",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("grants_access", models.BooleanField(default=False)),
                ("arx_category_id", models.CharField(blank=True, default="", max_length=100)),
                ("notes", models.CharField(blank=True, default="", max_length=300)),
                (
                    "area",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="arx_mapping",
                        to="janhus.janhusarea",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ExternalCardHolder",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(help_text="Shown in ARX and in the door log.", max_length=150)),
                ("pin_code_encrypted", models.TextField(blank=True, default="", editable=False)),
                ("notes", models.CharField(blank=True, default="", max_length=300)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "card",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="external_holder",
                        to="nfc.nfccard",
                    ),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "external card holder",
                "permissions": [
                    ("manage_external_card_access", "Can give external cards door access for JanHus bookings")
                ],
            },
        ),
        migrations.CreateModel(
            name="ArxPersonSync",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("external_id", models.CharField(max_length=64, unique=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("PENDING", "Pending"),
                            ("SYNCED", "Synced"),
                            ("FAILED", "Failed"),
                            ("BLOCKED", "Blocked (no card or PIN)"),
                        ],
                        default="PENDING",
                        max_length=10,
                    ),
                ),
                ("synced_hash", models.CharField(blank=True, default="", max_length=64)),
                ("issued_hash", models.CharField(blank=True, default="", max_length=64)),
                ("attempts", models.PositiveIntegerField(default=0)),
                (
                    "last_error",
                    models.CharField(
                        blank=True, default="", help_text="Error class only, never ARX text.", max_length=60
                    ),
                ),
                ("last_attempt_at", models.DateTimeField(blank=True, null=True)),
                ("synced_at", models.DateTimeField(blank=True, null=True)),
                ("conflict_arx_person_id", models.CharField(blank=True, default="", max_length=64)),
                ("conflict_arx_person_name", models.CharField(blank=True, default="", max_length=200)),
                ("conflict_hash", models.CharField(blank=True, default="", max_length=64)),
                ("takeover_from_arx_person_id", models.CharField(blank=True, default="", max_length=64)),
                ("takeover_approved_at", models.DateTimeField(blank=True, null=True)),
                (
                    "external_holder",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="arx_sync",
                        to="arx.externalcardholder",
                    ),
                ),
                (
                    "takeover_approved_by",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "takeover_card",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="+",
                        to="nfc.nfccard",
                    ),
                ),
                (
                    "user",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="arx_sync",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "permissions": [
                    ("approve_card_takeover", "Can approve moving a card from a person added by hand in ARX")
                ],
            },
        ),
        migrations.CreateModel(
            name="ArxObservedCardFormat",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("format_name", models.CharField(max_length=100)),
                ("observed_at", models.DateTimeField(auto_now=True)),
                (
                    "card",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="arx_observed_format",
                        to="nfc.nfccard",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ArxImportedEvent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("arx_event_id", models.CharField(max_length=64, unique=True)),
                ("imported_at", models.DateTimeField(auto_now_add=True)),
                (
                    "event",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="arx_import",
                        to="nfc.nfcaccessevent",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ExternalBookingAccess",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("added_at", models.DateTimeField(auto_now_add=True)),
                (
                    "added_by",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "booking",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="external_card_access",
                        to="janhus.janhusbooking",
                    ),
                ),
                (
                    "holder",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="booking_access",
                        to="arx.externalcardholder",
                    ),
                ),
            ],
            options={
                "verbose_name": "external booking access",
                "verbose_name_plural": "external booking access",
            },
        ),
        migrations.AddIndex(
            model_name="arxpersonsync",
            index=models.Index(fields=["status"], name="arx_personsync_status_idx"),
        ),
        migrations.AddConstraint(
            model_name="externalbookingaccess",
            constraint=models.UniqueConstraint(
                fields=("booking", "holder"), name="arx_unique_external_access_per_booking"
            ),
        ),
    ]
