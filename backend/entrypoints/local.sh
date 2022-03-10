#!/bin/sh
set -e

python manage.py migrate
python manage.py graphql_schema
./wait-for-it.sh postgres:5432 -- python manage.py runserver 0.0.0.0:8000
exec "$@"
