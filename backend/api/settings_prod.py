import os

from api.settings import *

DEBUG = True

ALLOWED_HOSTS = ["indokweb-alb-765354250.eu-north-1.elb.amazonaws.com", ".indokweb-alb-765354250.eu-north-1.elb.amazonaws.com"]

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

