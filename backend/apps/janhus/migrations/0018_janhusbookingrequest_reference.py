from django.db import migrations, models

REFERENCE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"


def _generate(random):
    def block():
        return "".join(random.choice(REFERENCE_ALPHABET) for _ in range(4))

    return f"JH-{block()}-{block()}"


def backfill_references(apps, schema_editor):
    """
    Existing requests predate the field, so give each one a reference that is free
    in both tables. Adding the unique constraint in the next step would otherwise
    fail on the shared empty-string default.
    """
    import random as _random

    booking_request_model = apps.get_model("janhus", "JanHusBookingRequest")
    booking_model = apps.get_model("janhus", "JanHusBooking")

    taken = set(
        booking_model.objects.exclude(reference="").values_list("reference", flat=True)
    )
    taken.update(
        booking_request_model.objects.exclude(reference="").values_list(
            "reference", flat=True
        )
    )

    for request in booking_request_model.objects.filter(reference=""):
        reference = _generate(_random)
        while reference in taken:
            reference = _generate(_random)
        taken.add(reference)
        request.reference = reference
        request.save(update_fields=["reference"])


class Migration(migrations.Migration):

    dependencies = [
        ("janhus", "0017_booking_level_flags"),
    ]

    operations = [
        migrations.AddField(
            model_name="janhusbookingrequest",
            name="reference",
            field=models.CharField(
                blank=True, default="", editable=False, max_length=16
            ),
        ),
        migrations.RunPython(backfill_references, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="janhusbookingrequest",
            name="reference",
            field=models.CharField(
                blank=True, default="", editable=False, max_length=16, unique=True
            ),
        ),
    ]
