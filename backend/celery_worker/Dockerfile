FROM python:3.9
ADD requirements.txt /app/requirements.txt
ADD ./ /app/celery_worker
WORKDIR /app/
RUN pip install -r requirements.txt
ENTRYPOINT celery -A celery_worker worker --concurrency=20 --loglevel=info