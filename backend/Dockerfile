# syntax=docker/dockerfile:1

FROM python:3.9
ENV PYTHONUNBUFFERED 1
RUN mkdir -p /api
WORKDIR /api
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

ENTRYPOINT ["/api/entrypoint.sh"]