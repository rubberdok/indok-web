#!/bin/sh
if python manage.py migrate; then
    exit python manage.py test
fi
exec "$@"