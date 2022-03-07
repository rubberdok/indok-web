#!/bin/bash
set -e
source .env
sleep 30 # Can be removed when this issue is resolved: https://github.com/mher/flower/issues/1112
celery -A celery_worker flower --basic_auth=${CELERY_FLOWER_USER}:${CELERY_FLOWER_PASS}
