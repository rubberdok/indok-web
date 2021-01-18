![](https://codebuild.eu-north-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiMDVZaEw3WW5La1QvRzJJb3prL1grZ2piREtxUU5HaXhDd0h2d05uRjNFWHBQellaTnljNXpGVFY3MmFCaWpoSUE4aXJScW1IUnFQMjQrU002RFRCR1FRPSIsIml2UGFyYW1ldGVyU3BlYyI6Imw2WUFzNkxnQkl2SGgrUzkiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)
[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/sindresorhus/awesome)

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
