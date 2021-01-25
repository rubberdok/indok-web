#!/bin/sh
python manage.py migrate --settings api.settings_prod
python manage.py runserver 0.0.0.0:8000 --settings api.settings_prod
exec "$@"