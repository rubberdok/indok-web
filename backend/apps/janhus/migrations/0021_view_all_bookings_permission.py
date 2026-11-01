"""
Add the permission janhus.view_all_bookings: see every JanHus booking and request
on the admin page, with contact details, guest lists and prices, without being
able to change anything. Changing still needs janhus.manage_booking.
"""

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("janhus", "0020_price_override_tier_not_null"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="janhusbooking",
            options={
                "ordering": ["starts_at"],
                "permissions": [
                    ("manage_booking", "Can manage JanHus bookings"),
                    ("manage_settings", "Can manage JanHus booking settings"),
                    ("review_booking", "Can review JanHus bookings"),
                    ("view_all_bookings", "Can view all JanHus bookings and requests, without editing"),
                ],
                "verbose_name": "JanHus booking",
                "verbose_name_plural": "JanHus bookings",
            },
        ),
    ]
