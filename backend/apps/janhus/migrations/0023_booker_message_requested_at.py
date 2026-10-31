from django.db import migrations, models


class Migration(migrations.Migration):
    """
    booker_message: what the admins write to the booker, sent with the status mails. admin_comment
    becomes internal to the admins. requested_at: when the request behind a booking was sent; the
    request itself is deleted when it is approved. Old bookings keep it empty: their requests are gone.
    """

    dependencies = [
        ("janhus", "0022_door_access_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="janhusbooking",
            name="booker_message",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="janhusbooking",
            name="requested_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="janhusbookingrequest",
            name="booker_message",
            field=models.TextField(blank=True, default=""),
        ),
    ]
