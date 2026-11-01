"""
Door access at JanHus (used by apps.arx), all set by JanHus admins:

- booker_user: the website user who booked. Until now an approved request
  kept only the approving admin (created_by_user), so the requester was lost.
- organization_door_access: for organisation bookings, the organisation's
  leaders (HR, the default) or only the booker.
- responsible_user: the responsible person on the website: found by their Feide
  email when the booking is made, or by a search on the admin page.
- door_access_policy gets BOOKER_AND_RESPONSIBLE, which the admin page already
  offered but the backend refused; ALL_PARTICIPANTS now includes the responsible
  person too, as the admin page said.

Existing bookings are filled in where it is unambiguous: the booker is the owner of
a personal booking, or for an organisation booking the one active user whose Feide
email equals the booker email; the responsible person is the one active user whose
Feide email equals the responsible email. Only Feide emails count, because Feide
verifies them and anyone can type a profile email. Admins can change both.
"""

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def _feide_user_id(user_model, email):
    email = (email or "").strip()
    if not email:
        return None
    matches = list(
        user_model.objects.filter(feide_email__iexact=email, is_active=True).values_list("id", flat=True)[:2]
    )
    return matches[0] if len(matches) == 1 else None


def fill_booker_user(apps, schema_editor):
    booking_model = apps.get_model("janhus", "JanHusBooking")
    user_model = apps.get_model(*settings.AUTH_USER_MODEL.split("."))
    for booking in booking_model.objects.all().iterator():
        changed = []
        if booking.booker_user_id is None:
            user_id = booking.owner_user_id
            if user_id is None and booking.owner_organization_id:
                user_id = _feide_user_id(user_model, booking.booker_email)
            if user_id is not None:
                booking.booker_user_id = user_id
                changed.append("booker_user")
        if booking.responsible_user_id is None:
            user_id = _feide_user_id(user_model, booking.responsible_email)
            if user_id is not None:
                booking.responsible_user_id = user_id
                changed.append("responsible_user")
        if changed:
            booking.save(update_fields=changed)


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("janhus", "0021_view_all_bookings_permission"),
    ]

    operations = [
        migrations.AddField(
            model_name="janhusbooking",
            name="booker_user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="janhus_booker_bookings",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="janhusbooking",
            name="responsible_user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="janhus_responsible_bookings",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="janhusbooking",
            name="organization_door_access",
            field=models.CharField(
                choices=[
                    ("LEADERS", "The organisation's leaders (HR)"),
                    ("BOOKER_ONLY", "Only the booker"),
                ],
                default="LEADERS",
                max_length=16,
            ),
        ),
        migrations.AlterField(
            model_name="janhusbooking",
            name="door_access_policy",
            field=models.CharField(
                choices=[
                    ("BOOKER_ONLY", "Booker only"),
                    ("BOOKER_AND_RESPONSIBLE", "Booker and responsible"),
                    ("ALL_PARTICIPANTS", "Booker, responsible and guest list"),
                ],
                default="BOOKER_ONLY",
                max_length=32,
            ),
        ),
        migrations.RunPython(fill_booker_user, migrations.RunPython.noop),
    ]
