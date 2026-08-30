"""
Make `price_override_tier` a plain, never-NULL string field.

The column allowed both NULL and "" to mean "no price override", which is two
representations of one state. Existing rows are backfilled to "" before the
constraint changes, so the AlterField cannot fail on leftover NULLs.
"""
from django.db import migrations, models


def clear_null_tiers(apps, schema_editor):
    booking_model = apps.get_model("janhus", "JanHusBooking")
    booking_model.objects.filter(price_override_tier__isnull=True).update(
        price_override_tier=""
    )


class Migration(migrations.Migration):

    dependencies = [
        ("janhus", "0019_repair_vipps_order_column"),
    ]

    operations = [
        migrations.RunPython(clear_null_tiers, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="janhusbooking",
            name="price_override_tier",
            field=models.CharField(
                blank=True,
                choices=[("INTERNAL", "Internal"), ("EXTERNAL", "External")],
                default="",
                max_length=16,
            ),
        ),
    ]
