from django.core.management.base import BaseCommand
from django.db import transaction
from apps.integrationserver.utils import UserFactories


class Command(BaseCommand):
    help = "Runs a development server with data from the given fixture(s)."

    def handle(self, **options):
        with transaction.atomic():
            UserFactories()
