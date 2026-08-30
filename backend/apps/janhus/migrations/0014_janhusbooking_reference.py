from django.db import migrations, models

from apps.janhus.models import generate_booking_reference


def assign_booking_references(apps, schema_editor):
    """
    Give every existing booking its own reference. Done row by row rather than with
    a field default, because a default would give every existing row the same value
    and break the unique constraint added below.
    """
    booking_model = apps.get_model("janhus", "JanHusBooking")

    taken = set(
        booking_model.objects.exclude(reference="").values_list("reference", flat=True)
    )

    for booking in booking_model.objects.filter(reference="").only("id"):
        reference = generate_booking_reference()
        while reference in taken:
            reference = generate_booking_reference()
        taken.add(reference)

        booking.reference = reference
        booking.save(update_fields=["reference"])


def clear_booking_references(apps, schema_editor):
    booking_model = apps.get_model("janhus", "JanHusBooking")
    booking_model.objects.update(reference="")


class Migration(migrations.Migration):

    dependencies = [
        ("janhus", "0013_janhusbookingsettings_payment_provider_organization"),
    ]

    operations = [
        migrations.AddField(
            model_name="janhusbooking",
            name="reference",
            field=models.CharField(
                blank=True, default="", editable=False, max_length=16
            ),
        ),
        migrations.RunPython(assign_booking_references, clear_booking_references),
        migrations.AlterField(
            model_name="janhusbooking",
            name="reference",
            field=models.CharField(
                blank=True, default="", editable=False, max_length=16, unique=True
            ),
        ),
    ]
