# Generated by Django 3.2.11 on 2022-02-10 17:23

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("cabins", "0018_auto_20211007_1740"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="booking",
            options={
                "permissions": [
                    ("send_email", "Can send email"),
                    ("manage_booking", "Can manage bookings, used for admins"),
                ]
            },
        ),
    ]
