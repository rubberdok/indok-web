FROM python:3.9
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/api
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

ENTRYPOINT ["/usr/src/api/entrypoint.sh"]