#!/bin/bash
set -e
source .env
celery -A celery_worker flower --basic_auth=${CELERY_FLOWER_USER}:${CELERY_FLOWER_PW}
