#!/bin/sh
set -e pipefail
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
exec "$@"