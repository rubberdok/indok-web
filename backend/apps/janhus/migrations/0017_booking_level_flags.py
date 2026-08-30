from django.db import migrations


class Migration(migrations.Migration):
    """
    RenameField rather than remove+add, so the existing value survives: the
    Priority Organization level has this set, and a remove+add would silently
    reset it to the default and stop it challenging provisionals.

    The two edit flags are dropped because nothing ever read them. Edit rights
    follow booking ownership instead - see is_booking_owner and the
    owner_restricted_fields list in UpdateJanHusBooking.
    """

    dependencies = [
        ("janhus", "0016_auto_20260829_2319"),
    ]

    operations = [
        migrations.RenameField(
            model_name="janhusbookinglevel",
            old_name="can_override_lower_levels",
            new_name="can_challenge_provisionals",
        ),
        migrations.RemoveField(
            model_name="janhusbookinglevel",
            name="can_edit_own_bookings_only",
        ),
        migrations.RemoveField(
            model_name="janhusbookinglevel",
            name="can_edit_all_bookings",
        ),
    ]
