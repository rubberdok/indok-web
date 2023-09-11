# pull official base image
FROM --platform=linux/amd64 public.ecr.aws/docker/library/python:3.9-slim

# set work directory
WORKDIR /usr/src/app

# install weasyprint dependencies
RUN apt-get update && \
    apt-get install -y \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    dos2unix

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY requirements ./requirements
RUN pip install -r ./requirements/local.txt

# copy entrypoint.sh
COPY entrypoints ./entrypoints
RUN chmod +x ./entrypoints/*.sh

# copy project
COPY . .
RUN dos2unix ./entrypoints/*.sh wait-for-it.sh


# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoints/local.sh"]
