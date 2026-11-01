"""
The status "Foreløpig" (PROVISIONAL) is gone. A booking that waits for payment is
"Venter behandling" (PENDING_ADMIN_REVIEW) until it is paid, so existing provisional
bookings move there. Migrating back leaves them there: nothing records which they were.
"""

from django.db import migrations, models


def provisional_to_pending(apps, schema_editor):
    booking_model = apps.get_model("janhus", "JanHusBooking")
    booking_model.objects.filter(status="PROVISIONAL").update(status="PENDING_ADMIN_REVIEW")


class Migration(migrations.Migration):
    dependencies = [
        ("janhus", "0024_remove_booking_levels"),
    ]

    operations = [
        migrations.RunPython(provisional_to_pending, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="janhusbooking",
            name="status",
            field=models.CharField(
                choices=[
                    ("PENDING_ADMIN_REVIEW", "Pending admin review"),
                    ("CONFIRMED", "Confirmed"),
                    ("DECLINED", "Declined"),
                    ("CANCELLED", "Cancelled"),
                    ("BLOCKED", "Blocked"),
                ],
                default="PENDING_ADMIN_REVIEW",
                max_length=32,
            ),
        ),
    ]
