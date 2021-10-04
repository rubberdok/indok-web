from django.apps import AppConfig


class FormsConfig(AppConfig):
    name = "apps.forms"

    def ready(self) -> None:
        import apps.forms.signals  # noqa

        return super().ready()
