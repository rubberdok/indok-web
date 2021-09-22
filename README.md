<h1 align="center">Indøk NTNU</h1><br>
<p align="center">
  <a href="https://www.indokntnu.no/">
    &nbsp;&nbsp;&nbsp;&nbsp;<img alt="Logo" title="Rubberdøk" src="https://github.com/hovedstyret/indok-web/blob/docs/assets/logo_black.svg" width="300">
  </a>
</p>

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Feedback](#feedback)
- [Setup](#setup)
- [Acknowledgements](#acknowledgements)

## Introduction

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://opensource.org/licenses/MIT)
[![AWS](https://github.com/hovedstyret/indok-web/actions/workflows/aws.yml/badge.svg)](https://github.com/hovedstyret/indok-web/actions/workflows/aws.yml)
[![Code style](https://img.shields.io/badge/code%20style-black-black?style=flat)](https://github.com/psf/black)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)
![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)

Website for the students at Industrial Economics and Technology Management at NTNU. Built with Django, React/Next.js, and GraphQL API. Built and maintained by Rubberdøk NTNU.

<p align="center">
  <a href="https://www.indokntnu.no/">
    <img alt="Landing Page" title="Indøk NTNU" src="https://github.com/hovedstyret/indok-web/blob/docs/assets/Index.png" width="600">
  </a>
</p>

## Features

The website includes:

- Fully automated booking of cabins including payment
- View and register for upcoming events
- Apply for Indøk's student organizations
- OAuth login with Feide

## Feedback

[File an issue](https://github.com/hovedstyret/indok-web/issues/new)!

## Setup
### Installing and running

1. [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)

1. Install and start [Docker Desktop](https://www.docker.com/products/docker-desktop)

2. Clone the project and build the Docker images

```
git clone https://github.com/hovedstyret/indok-web.git
cd indok-web
docker compose build
```

3. Run the project in Docker and set up the database

```
docker compose up
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser --username=admin
docker compose exec backend python manage.py loaddata example_data
```

4. Install commit hooks

```
cd frontend
npm ci
```

The frontend runs on [`localhost:3000`](localhost:3000), and the backend on [`localhost:8000`](localhost:8000). The GraphQL API endpoint is [`localhost:8000/graphql`](localhost:8000/graphql).

### Environment variables

In order to authenticate users through Feide, Indøk Hovedstyre Webkomité has registered an application at Dataporten. This requires the addition of environment variables identifying the application. Contributors may specify a different client ID and secret to authenticate with Dataporten through their own application. See [Feide docs](https://docs.feide.no/service_providers/index.html) for more information. Additionally, several other APIs are accessed, requiring different API keys for access.

1. Create a file called `.env.local` in `frontend/` and add the variables that can be found in `.env.local.template`, with appropriate values.

   - `NEXT_PUBLIC_DATAPORTEN_ID` should be `fcaa9e30-a6d3-4809-8fea-cdd7b3de1c98` for the Indøk Hovedstyre Webkomité development client at Dataporten.

2. Create a file called `.env`in `backend/api/` and add the variables that can be found in `backend/api/.env.example`, with appropriate values.

   - `DATAPORTEN_ID` should be the same as above if using the Indøk Hovedstyre Webkomité client.
   - Contact the maintainers if you are a developer of the project and need access to the various secrets and API keys needed for the project.


## Deployment

The app uses Github actions to deploy to AWS Elastic Container Service, the deployment steps can be found in the `aws.yml` workflow.
In short, the process is as follows:

1.  Build, tag, and push frontend and backend images to Amazon Elastic Container Registry
2.  Update and deploy updated task definitions for frontend and backend referencing the newly tagged images.
3.  Notify Github and Sentry of a successful release

## Acknowledgements

<p float="left">
  <a href="https://github.com/Skraagen">
    <img alt="Skraagen" src="https://avatars1.githubusercontent.com/u/18050179?s=400&v=4" width="14">
  </a>
  Logo created by Skraagen 🦆
</p>

[IndokNTNU.no](https://www.indokntnu.no) is powered by:

<p float="left">
  <a href="https://graphql.org/">
     <img alt="GraphQL" src="https://upload.wikimedia.org/wikipedia/commons/1/17/GraphQL_Logo.svg" height="50">
  </a>
  &nbsp;
  <a href="https://reactjs.org">
    <img alt="ReactJS" src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" height="50">
  </a>
  &nbsp;
  <a href="https://nextjs.org">
    <img alt="NextJS" src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" height="50">
  </a>
  &nbsp;
  <a href="https://www.python.org">
    <img alt="Python" src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" height="50">
  </a>
  &nbsp;
  <a href="https://www.djangoproject.com">
    <img alt="Django" src="https://upload.wikimedia.org/wikipedia/commons/7/75/Django_logo.svg" height="50">
  </a>
  &nbsp;
  <a href="https://www.docker.com">
    <img alt="Docker" src="https://www.docker.com/sites/default/files/d8/styles/role_icon/public/2019-07/vertical-logo-monochromatic.png?itok=erja9lKc" height="50">
  </a>
  &nbsp;
  <a href="https://aws.amazon.com/">
    <img src="https://d0.awsstatic.com/logos/powered-by-aws.png" alt="Powered by AWS Cloud Computing", height="50">
  </a>
</p>
