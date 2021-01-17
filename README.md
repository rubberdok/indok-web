# indok-web
Nettsiden til Hovedstyret for Industriell Økonomi og Teknologiledelse NTNU

# Setup

## Environment variables
Create a file called `.env.local` in `frontend/` and add the variables that can be found in `.env.local.template`, with appropriate values.
- `NEXT_PUBLIC_DATAPORTEN_ID` should be `f17d2ea0-a7c9-4458-83bf-35cf5b555cae` for the Indøk Hovedstyre Webkomité client at Dataporten.

Create a file called `.env`in `backend/api/` and add the variables that can be found in `backend/api/.env.example`, with appropriate values.
- `DATAPORTEN_ID` should be the same as if using the Indøk Hovedstyre Webkomité client.
- Contact the maintainers if you are a developer of the project and need access to the `DATAPORTEN_SECRET` for the client.

## Running the project
Install Docker Desktop: https://www.docker.com/products/docker-desktop

`docker-compose up`

`docker-compose exec backend python manage.py migrate`

`docker-compose exec backend python manage.py createsuperuser`

## Commit hooks
To install commit hooks, install frontend locally:

`cd frontend`

`npm install`
