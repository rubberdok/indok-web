#!/bin/sh
set -e

./wait-for-it.sh postgres:5432 -- echo "Postgres is up"
python manage.py migrate
python manage.py loadfactories
gunicorn config.wsgi:application --bind 0.0.0.0:8000
exec "$@"
