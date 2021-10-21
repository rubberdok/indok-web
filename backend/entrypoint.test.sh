#!/bin/sh
set -e

python manage.py migrate
python manage.py integrationserver --addrport 8000 --no-input
exec "$@"
