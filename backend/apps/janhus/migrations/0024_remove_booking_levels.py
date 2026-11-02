"""
Booking levels are gone: the booking settings decide a new booking's status.

This drops the levels, their assignments to users and organisations, and each
booking's level. Migrating back makes the tables again, empty. To bring the levels
back, see the note in rules.determine_initial_status (the commit "refactor(janhus): fjern
bookingnivåer").
"""

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("janhus", "0023_booker_message_requested_at"),
    ]

    operations = [
        migrations.RemoveField(model_name="janhusbooking", name="booking_level"),
        migrations.DeleteModel(name="JanHusOrganizationBookingLevel"),
        migrations.DeleteModel(name="JanHusUserBookingLevel"),
        migrations.DeleteModel(name="JanHusBookingLevel"),
    ]
