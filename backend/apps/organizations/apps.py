from django.apps import AppConfig


class OrganizationsConfig(AppConfig):
    name = "apps.organizations"

    def ready(self):
        import apps.organizations.signals  # noqa
