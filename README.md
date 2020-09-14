# indok-web
Nettsiden til Hovedstyret for Industriell Økonomi og Teknologiledelse NTNU

# Setup
Install Docker Desktop: https://www.docker.com/products/docker-desktop

`docker-compose up`

`docker-compose exec backend python manage.py migrate`

`docker-compose exec backend python manage.py createsuperuser`

# Commit hooks
To install commit hooks, install frontend locally:

`cd frontend`

`npm install`
