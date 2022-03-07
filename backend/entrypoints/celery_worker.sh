#!/bin/bash
set -e
source .env
celery -A celery_worker worker --concurrency=$CELERY_CONCURRENCY --loglevel=$CELERY_LOGLEVEL -Q $CELERY_QUEUES
