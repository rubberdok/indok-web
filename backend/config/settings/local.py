from corsheaders.defaults import default_headers

from .base import *  # noqa
from .base import env

# GENERAL
DEBUG = True

SECRET_KEY = env(
    "DJANGO_SECRET_KEY",
    default="!!!SET DJANGO_SECRET_KEY!!!",
)

# URLs
ENVIRONMENT = env("DJANGO_ENVIRONMENT", default="development")
FRONTEND_BASE_URL = env("FRONTEND_BASE_URL", default="http://localhost:3000")

# ACCESS
ALLOWED_HOSTS = ["localhost", "0.0.0.0", "127.0.0.1", "backend"]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = list(default_headers) + ["sentry-trace", "baggage"]

EMAIL_BACKEND = env("DJANGO_EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend")
AWS_SES_REGION_NAME = env("AWS_SES_REGION_NAME", default="eu-north-1")
AWS_SES_REGION_ENDPOINT = env("AWS_SES_REGION_ENDPOINT", default="email.eu-north-1.amazonaws.com")
