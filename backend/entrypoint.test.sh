#!/bin/sh
python manage.py migrate --check
python manage.py test
exec "$@"