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
