from django.db import migrations, models


def _pin_cipher(rows_to_convert: int):
    """
    The cipher for door PINs: the first key in NFC_PIN_ENCRYPTION_KEY encrypts, every
    key in it (comma separated) decrypts. Refuses clearly, before anything changes,
    when PINs exist and the setting is missing or not Fernet keys.
    """
    from cryptography.fernet import Fernet, MultiFernet
    from django.conf import settings

    raw = getattr(settings, "NFC_PIN_ENCRYPTION_KEY", "") or ""
    try:
        return MultiFernet([Fernet(key.strip()) for key in raw.split(",") if key.strip()])
    except (TypeError, ValueError):
        raise RuntimeError(
            f"{rows_to_convert} door PIN(s) need NFC_PIN_ENCRYPTION_KEY, which is missing or "
            "not a Fernet key. Set it, then run migrate again. Nothing has been changed."
        ) from None


def encrypt_existing_pins(apps, schema_editor):
    assignment_model = apps.get_model("nfc", "NfcCardAssignment")
    rows = assignment_model.objects.exclude(pin_code="")
    count = rows.count()
    if not count:
        return
    cipher = _pin_cipher(count)
    for row in rows.iterator():
        row.pin_code_encrypted = cipher.encrypt(row.pin_code.encode()).decode()
        row.save(update_fields=["pin_code_encrypted"])


def decrypt_pins_back(apps, schema_editor):
    """
    Rollback: Django has already re-created the plain pin_code column (empty);
    put each PIN back before pin_code_encrypted is dropped, so no PIN is lost.
    """
    assignment_model = apps.get_model("nfc", "NfcCardAssignment")
    rows = assignment_model.objects.exclude(pin_code_encrypted="")
    count = rows.count()
    if not count:
        return
    from cryptography.fernet import InvalidToken

    cipher = _pin_cipher(count)
    for row in rows.iterator():
        try:
            row.pin_code = cipher.decrypt(row.pin_code_encrypted.encode()).decode()
        except InvalidToken:
            raise RuntimeError(
                "A door PIN cannot be decrypted with NFC_PIN_ENCRYPTION_KEY: it was encrypted with "
                "another key. Set the key the PINs were encrypted with, then migrate again. "
                "Nothing has been changed."
            ) from None
        row.save(update_fields=["pin_code"])


class Migration(migrations.Migration):
    """
    - NfcCard.card_number: the number as printed on the user's card. Existing cards
      keep it empty and are shown by their door number (mifare_csn).
    - Unused parts removed: NfcAccessGrant (door access now comes from JanHus
      bookings through apps.arx) and the assignment's external holder, access
      window and metadata. permanent_access is kept: apps.arx now grants it.
      A rollback re-creates these empty: nothing in indok-web filled them.
    - Door PINs are stored encrypted (pin_code -> pin_code_encrypted).
      NFC_PIN_ENCRYPTION_KEY must be set before this runs whenever any PIN exists,
      both forwards and on rollback. A rollback decrypts every PIN back into
      pin_code, so no PIN is lost in either direction.
    - NfcAccessEvent.person_name: the name the door system reports, for the door log,
      and the permission nfc.view_door_log for the door log page.
    """

    dependencies = [
        ("nfc", "0006_auto_20260811_1329"),
    ]

    operations = [
        migrations.AddField(
            model_name="nfccard",
            name="card_number",
            field=models.CharField(blank=True, default="", max_length=32),
        ),
        migrations.RemoveConstraint(
            model_name="nfccardassignment",
            name="nfc_assignment_access_end_after_start",
        ),
        migrations.RemoveIndex(
            model_name="nfccardassignment",
            name="nfc_nfccard_access__c9cd69_idx",
        ),
        migrations.RemoveField(model_name="nfccardassignment", name="external_holder_name"),
        migrations.RemoveField(model_name="nfccardassignment", name="access_start"),
        migrations.RemoveField(model_name="nfccardassignment", name="access_end"),
        migrations.RemoveField(model_name="nfccardassignment", name="metadata"),
        migrations.DeleteModel(name="NfcAccessGrant"),
        migrations.AddField(
            model_name="nfccardassignment",
            name="pin_code_encrypted",
            field=models.TextField(blank=True, default="", editable=False),
        ),
        migrations.RunPython(encrypt_existing_pins, decrypt_pins_back),
        migrations.RemoveField(model_name="nfccardassignment", name="pin_code"),
        migrations.AlterModelOptions(
            name="nfcaccessevent",
            options={"permissions": [("view_door_log", "Can view the JanHus door log")]},
        ),
        migrations.AddField(
            model_name="nfcaccessevent",
            name="person_name",
            field=models.CharField(blank=True, default="", max_length=200),
        ),
    ]
