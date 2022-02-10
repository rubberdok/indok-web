from django.apps import AppConfig


class EcommerceConfig(AppConfig):
    name = "apps.ecommerce"

    def ready(self) -> None:
        import apps.ecommerce.signals  # noqa

        return super().ready()
