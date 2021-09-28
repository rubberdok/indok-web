#!/bin/sh
python manage.py migrate
if python manage.py test; then
    exit 1
else
    exit 0
fi
exec "$@"