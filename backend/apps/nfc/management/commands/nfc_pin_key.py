"""
Change NFC_PIN_ENCRYPTION_KEY without anyone typing their PIN again.

NFC_PIN_ENCRYPTION_KEY holds one Fernet key, or several separated by commas: the first
encrypts new PINs, and every key in the list still decrypts. To change the key (when it
may have leaked, or at the yearly handover):

  1. Put the new key first and keep the old one after a comma ("new,old"). Deploy.
  2. python manage.py nfc_pin_key --reencrypt    every stored PIN now uses the new key
  3. python manage.py nfc_pin_key                check: all on the first key
  4. Remove the old key. Deploy.

It covers every model with a pin_code_encrypted field: the card assignments, and the
external card holders of apps.arx. It never prints or logs a PIN.
"""

from cryptography.fernet import Fernet, InvalidToken
from django.apps import apps
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.nfc.models import pin_cipher, pin_encryption_keys

FIELD = "pin_code_encrypted"


def models_with_pins() -> list:
    return [model for model in apps.get_models() if any(f.name == FIELD for f in model._meta.get_fields())]


class Command(BaseCommand):
    help = "Check the stored door PINs against NFC_PIN_ENCRYPTION_KEY, or re-encrypt them with its first key."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reencrypt",
            action="store_true",
            help="Re-encrypt every stored PIN with the first key in NFC_PIN_ENCRYPTION_KEY.",
        )

    def handle(self, *args, **options):
        keys = pin_encryption_keys()
        if not keys:
            raise CommandError("NFC_PIN_ENCRYPTION_KEY is not set.")
        cipher = pin_cipher()
        if options["reencrypt"]:
            self.reencrypt(cipher)
        self.check_keys(cipher, Fernet(keys[0]), len(keys))

    @staticmethod
    def stored(model):
        return model.objects.exclude(**{FIELD: ""})

    @transaction.atomic
    def reencrypt(self, cipher):
        for model in models_with_pins():
            changed = 0
            for pk, token in self.stored(model).select_for_update().values_list("pk", FIELD).iterator():
                try:
                    new_token = cipher.rotate(token.encode()).decode()
                except InvalidToken:
                    raise CommandError(
                        f"A PIN in {model._meta.label} cannot be read with any key in NFC_PIN_ENCRYPTION_KEY. "
                        "Add the key it was encrypted with. Nothing has been changed."
                    ) from None
                model.objects.filter(pk=pk).update(**{FIELD: new_token})
                changed += 1
            self.stdout.write(f"{model._meta.label}: {changed} PIN(s) re-encrypted with the first key")

    def check_keys(self, cipher, first, key_count):
        unreadable = 0
        for model in models_with_pins():
            on_first = on_older = bad = 0
            for token in self.stored(model).values_list(FIELD, flat=True).iterator():
                try:
                    first.decrypt(token.encode())
                    on_first += 1
                except InvalidToken:
                    try:
                        cipher.decrypt(token.encode())
                        on_older += 1
                    except InvalidToken:
                        bad += 1
            unreadable += bad
            self.stdout.write(
                f"{model._meta.label}: {on_first} on the first key, {on_older} on an older key, {bad} unreadable"
            )
        self.stdout.write(f"{key_count} key(s) in NFC_PIN_ENCRYPTION_KEY")
        if unreadable:
            raise CommandError(
                f"{unreadable} PIN(s) cannot be read with any key in NFC_PIN_ENCRYPTION_KEY. "
                "Add the key they were encrypted with."
            )
