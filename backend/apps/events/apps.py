from django.apps import AppConfig


class EventsConfig(AppConfig):
    name = "apps.events"

    def ready(self) -> None:
        import apps.events.signals  # noqa

        return super().ready()
