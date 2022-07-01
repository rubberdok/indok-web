#!/bin/sh
set -e

./wait-for-it.sh postgres:5432 -- echo "Postgres is up"
python manage.py migrate
python manage.py graphql_schema
python manage.py runserver 0.0.0.0:8000
exec "$@"
