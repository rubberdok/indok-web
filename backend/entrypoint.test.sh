#!/bin/sh
set -e

python manage.py migrate
python manage.py integrationserver --addrport 8000 --no-input
gunicorn config.wsgi:application --bind 0.0.0.0:8000
exec "$@"
