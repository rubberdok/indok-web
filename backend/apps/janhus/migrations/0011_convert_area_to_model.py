from decimal import Decimal

import django.db.models.deletion
from django.db import migrations, models


def migrate_area_data(apps, schema_editor):
    JanHusArea = apps.get_model("janhus", "JanHusArea")
    JanHusAreaConfiguration = apps.get_model("janhus", "JanHusAreaConfiguration")
    JanHusBooking = apps.get_model("janhus", "JanHusBooking")
    JanHusBookingRequest = apps.get_model("janhus", "JanHusBookingRequest")

    name_by_code = {
        "ENTIRE_HOUSE": "Hele huset",
        "FIRST_FLOOR": "1. etasje",
        "SECOND_FLOOR": "2. etasje",
    }
    parent_code_by_code = {
        "FIRST_FLOOR": "ENTIRE_HOUSE",
        "SECOND_FLOOR": "ENTIRE_HOUSE",
    }

    configs_by_code = {
        config.area: config for config in JanHusAreaConfiguration.objects.all()
    }

    areas_by_code = {}
    for code in ["ENTIRE_HOUSE", "FIRST_FLOOR", "SECOND_FLOOR"]:
        config = configs_by_code.get(code)
        areas_by_code[code] = JanHusArea.objects.create(
            name=name_by_code[code],
            internal_price_per_hour=(
                config.internal_price_per_hour if config else Decimal("0")
            ),
            external_price_per_hour=(
                config.external_price_per_hour if config else Decimal("0")
            ),
            cleaning_fee=config.cleaning_fee if config else Decimal("0"),
            default_deposit_amount=(
                config.default_deposit_amount if config else Decimal("0")
            ),
        )

    for code, parent_code in parent_code_by_code.items():
        area = areas_by_code[code]
        area.parent = areas_by_code[parent_code]
        area.save(update_fields=["parent"])

    for booking in JanHusBooking.objects.all():
        area = areas_by_code.get(booking.area)
        if area:
            booking.area_new = area
            booking.save(update_fields=["area_new"])

    for booking_request in JanHusBookingRequest.objects.all():
        area = areas_by_code.get(booking_request.area)
        if area:
            booking_request.area_new = area
            booking_request.save(update_fields=["area_new"])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("janhus", "0010_auto_20260826_1052"),
    ]

    operations = [
        # Local dev/test databases can carry stray artifacts from old schema-drift repair
        # migrations (0002/0003): a legacy "janhus_janhusarea" table with an unrelated schema,
        # and a stray "area_id" column pre-dating the "area" CharField. Clean those up first.
        migrations.RunSQL(
            "DROP TABLE IF EXISTS janhus_janhusarea CASCADE;"
            "ALTER TABLE janhus_janhusbooking DROP COLUMN IF EXISTS area_id;"
            "ALTER TABLE janhus_janhusbookingrequest DROP COLUMN IF EXISTS area_id;",
            reverse_sql=migrations.RunSQL.noop,
        ),
        migrations.CreateModel(
            name="JanHusArea",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100, unique=True)),
                ("is_active", models.BooleanField(default=True)),
                (
                    "internal_price_per_hour",
                    models.DecimalField(
                        decimal_places=2, default=Decimal("0"), max_digits=10
                    ),
                ),
                (
                    "external_price_per_hour",
                    models.DecimalField(
                        decimal_places=2, default=Decimal("0"), max_digits=10
                    ),
                ),
                (
                    "cleaning_fee",
                    models.DecimalField(
                        decimal_places=2, default=Decimal("0"), max_digits=10
                    ),
                ),
                (
                    "default_deposit_amount",
                    models.DecimalField(
                        decimal_places=2, default=Decimal("0"), max_digits=10
                    ),
                ),
                (
                    "parent",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="children",
                        to="janhus.janhusarea",
                    ),
                ),
            ],
            options={
                "ordering": ["name"],
                "verbose_name": "JanHus area",
                "verbose_name_plural": "JanHus areas",
            },
        ),
        migrations.AddField(
            model_name="janhusbooking",
            name="area_new",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="bookings_new",
                to="janhus.janhusarea",
            ),
        ),
        migrations.AddField(
            model_name="janhusbookingrequest",
            name="area_new",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="booking_requests_new",
                to="janhus.janhusarea",
            ),
        ),
        migrations.RunPython(migrate_area_data, noop_reverse),
        migrations.RemoveField(model_name="janhusbooking", name="area"),
        migrations.RemoveField(model_name="janhusbookingrequest", name="area"),
        migrations.RenameField(
            model_name="janhusbooking", old_name="area_new", new_name="area"
        ),
        migrations.RenameField(
            model_name="janhusbookingrequest", old_name="area_new", new_name="area"
        ),
        migrations.AlterField(
            model_name="janhusbooking",
            name="area",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="bookings",
                to="janhus.janhusarea",
            ),
        ),
        migrations.AlterField(
            model_name="janhusbookingrequest",
            name="area",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="booking_requests",
                to="janhus.janhusarea",
            ),
        ),
        migrations.DeleteModel(name="JanHusAreaConfiguration"),
    ]
