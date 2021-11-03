from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = "Runs a development server with data from the given fixture(s)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--noinput",
            "--no-input",
            action="store_false",
            dest="interactive",
            help="Tells Django to NOT prompt the user for input of any kind.",
        )

    def handle(self, **options):
        verbosity = options["verbosity"]
        interactive = options["interactive"]

        # Create a test database.
        connection.creation.create_test_db(verbosity=verbosity, autoclobber=not interactive, serialize=False)

        call_command("loadfactories", **{"verbosity": verbosity})
