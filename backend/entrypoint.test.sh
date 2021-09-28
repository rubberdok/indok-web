#!/bin/sh
if python manage.py migrate; then
    exit python manage.py test
else
    exit 0
fi
exec "$@"