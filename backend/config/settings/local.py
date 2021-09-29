from .base import *
from .base import env

# GENERAL
DEBUG = True

SECRET_KEY = env(
    "DJANGO_SECRET_KEY",
    default="!!!SET DJANGO_SECRET_KEY!!!",
)

# ACCESS
ALLOWED_HOSTS = ["localhost", "0.0.0.0", "127.0.0.1"]
CORS_ORIGIN_WHITELIST = ["localhost:3000", "0.0.0.0:3000", "127.0.0.1:3000"]
CORS_ALLOW_CREDENTIALS = True

EMAIL_BACKEND = env("DJANGO_EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend")

# WhiteNoise
# http://whitenoise.evans.io/en/latest/django.html#using-whitenoise-in-development
INSTALLED_APPS = ["whitenoise.runserver_nostatic"] + INSTALLED_APPS
