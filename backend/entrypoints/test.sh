#!/bin/sh
set -e

python manage.py migrate
coverage run manage.py test
coverage xml
exec "$@"
