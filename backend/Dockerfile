# pull official base image
FROM python:3.9.6

# set work directory
WORKDIR /usr/src/app

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

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoints/local.sh"]
