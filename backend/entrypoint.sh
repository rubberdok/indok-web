#!/bin/sh
python manage.py migrate --settings api.settings
python manage.py runserver 0.0.0.0:8000 --settings api.settings
exec "$@"