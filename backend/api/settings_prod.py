import os

from api.settings import *

DEBUG = False

ALLOWED_HOSTS = ["api.gamma.indokntnu.no"]

CORS_ORIGIN_WHITELIST = ["https://gamma.indokntnu.no"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "postgres",
        "USER": "postgres",
        "PASSWORD": os.environ.get("DB_PASSWORD"),
        "HOST": os.environ.get("DB_HOST"),
        "PORT": 5432,
    }
}

SECRET_KEY = os.environ.get("SECRET_KEY")

DATAPORTEN_ID = os.environ.get("DATAPORTEN_ID")
DATAPORTEN_SECRET = os.environ.get("DATAPORTEN_SECRET")
DATAPORTEN_REDIRECT_URI = os.environ.get("DATAPORTEN_REDIRECT_URI")

EMAIL_HOST_USER = os.environ.get("BOOKING_EMAIL")
EMAIL_HOST_PASSWORD = os.environ.get("BOOKING_EMAIL_PASSWORD")
