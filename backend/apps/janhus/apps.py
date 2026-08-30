from django.apps import AppConfig


class JanHusConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.janhus"
    verbose_name = "JanHus"

    def ready(self) -> None:
        import apps.janhus.signals  # noqa: F401

        return super().ready()
