FROM python:3.9
ENV PYTHONUNBUFFERED 1
RUN mkdir -p /backend
WORKDIR /backend
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

ENTRYPOINT ["/backend/entrypoint.sh"]
