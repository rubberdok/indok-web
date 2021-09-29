# syntax=docker/dockerfile:1

FROM python:3.9
ENV PYTHONUNBUFFERED 1
RUN mkdir -p /backend
WORKDIR /backend
COPY requirements.txt .
RUN pip install -r requirements/local.txt

COPY . .

EXPOSE 8000

ENTRYPOINT ["/backend/entrypoint.sh"]