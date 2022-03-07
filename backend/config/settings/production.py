import logging
from typing import Optional, cast

import sentry_sdk
from corsheaders.defaults import default_headers
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.logging import LoggingIntegration, ignore_logger

from .base import *  # noqa
from .base import env

# GENERAL
SECRET_KEY = env("SECRET_KEY")
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["api.indokntnu.no"])
CORS_ALLOW_HEADERS = list(default_headers) + ["sentry-trace"]

CORS_ORIGIN_WHITELIST = env.list(
    "CORS_ORIGIN_WHITELIST",
    default=[
        "https://indokntnu.no",
        "https://www.indokntnu.no",
        "callback-1.vipps.no",
        "callback-2.vipps.no",
        "callback-3.vipps.no",
        "callback-4.vipps.no",
    ],
)


# DATABASES
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST"),
        "PORT": env.int("DB_PORT"),
    }
}

# URLs
ROOT_URLCONF = "config.urls.production"

# EMAIL
EMAIL_BACKEND = "django_ses.SESBackend"

AWS_SES_REGION_NAME = env("AWS_SES_REGION_NAME")
AWS_SES_REGION_ENDPOINT = env("AWS_SES_REGION_ENDPOINT")
AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
AWS_SES_AUTO_THROTTLE = env.float("AWS_SES_AUTO_THROTTLE")

# LOGGING
LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
    "formatters": {"verbose": {"format": "%(levelname)s %(asctime)s %(module)s " "%(process)d %(thread)d %(message)s"}},
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        }
    },
    "root": {"level": "INFO", "handlers": ["console"]},
    "loggers": {
        "django.db.backends": {
            "level": "ERROR",
            "handlers": ["console"],
            "propagate": False,
        },
        # Errors logged by the SDK itself
        "sentry_sdk": {"level": "ERROR", "handlers": ["console"], "propagate": False},
        "django.security.DisallowedHost": {
            "level": "ERROR",
            "handlers": ["console"],
            "propagate": False,
        },
    },
}

# GRAPHENE
GRAPHENE["MIDDLEWARE"] += ["config.sentry.middleware.SentryMiddleware"]  # noqa
GRAPHQL_JWT = {"JWT_COOKIE_DOMAIN": env("JWT_COOKIE_DOMAIN", default=".indokntnu.no")}

# Sentry
SENTRY_DSN: str = env("SENTRY_DSN")
SENTRY_LOG_LEVEL: int = cast(int, env.int("DJANGO_SENTRY_LOG_LEVEL", default=logging.INFO))
SENTRY_RELEASE: Optional[str] = env.str("GIT_COMMIT_SHA", "") or None

sentry_logging = LoggingIntegration(
    level=SENTRY_LOG_LEVEL,  # Capture info and above as breadcrumbs
    event_level=logging.ERROR,  # Send errors as events
)

integrations = [sentry_logging, DjangoIntegration()]

sentry_sdk.init(
    dsn=SENTRY_DSN,
    integrations=integrations,
    environment=ENVIRONMENT,  # noqa
    traces_sample_rate=cast(float, env.float("SENTRY_TRACES_SAMPLE_RATE", default=0.0)),
    send_default_pii=cast(bool, env.bool("SENTRY_SEND_DEFAULT_PII", default=True)),
    release=SENTRY_RELEASE,
)
ignore_logger("graphql.execution.utils")
