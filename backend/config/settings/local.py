from .base import *  # noqa
from .base import env

# GENERAL
DEBUG = True

SECRET_KEY = env(
    "DJANGO_SECRET_KEY",
    default="!!!SET DJANGO_SECRET_KEY!!!",
)

# URLs
ROOT_URLCONF = "config.urls.local"
# ENVIRONMENT = "development"

# ACCESS
ALLOWED_HOSTS = ["localhost", "0.0.0.0", "127.0.0.1"]
CORS_ORIGIN_WHITELIST = ["http://localhost:3000", "http://0.0.0.0:3000", "http://127.0.0.1:3000"]
CORS_ALLOW_CREDENTIALS = True

EMAIL_BACKEND = env("DJANGO_EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend")
AWS_SES_REGION_NAME = env("AWS_SES_REGION_NAME", default="eu-north-1")
AWS_SES_REGION_ENDPOINT = env("AWS_SES_REGION_ENDPOINT", default="email.eu-north-1.amazonaws.com")
