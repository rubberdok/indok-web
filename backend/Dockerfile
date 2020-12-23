FROM python:3.9
ENV PYTHONUNBUFFERED 1
RUN mkdir -p /code
WORKDIR /code
COPY requirements.txt /code
RUN pip install -r requirements.txt
COPY . .