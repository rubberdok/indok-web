from django.apps import AppConfig


class FormsConfig(AppConfig):
    name = "apps.forms"

    def ready(self):
        import apps.forms.signals #noqa
