<h1 align="center">Indøk NTNU</h1><br>
<p align="center">
  <a href="https://www.indokntnu.no/">
    <img alt="Logo" title="Rubberdøk" src="https://github.com/rubberdok/indok-web/blob/docs/assets/rubberdok_logo.svg" width="300">
  </a>
</p>

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Feedback](#feedback)
- [Setup](#setup)
- [Error Logging](#error-logging)
- [Deployment](#deployment)
- [Other Services](#other-services)
- [Acknowledgements](#acknowledgements)

## Introduction

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/rubberdok/indok-web/actions/workflows/ci.yml/badge.svg)](https://github.com/rubberdok/indok-web/actions/workflows/ci.yml)
[![Code style](https://img.shields.io/badge/code%20style-black-black?style=flat)](https://github.com/psf/black)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![codecov](https://codecov.io/gh/rubberdok/indok-web/branch/main/graph/badge.svg?token=UO2NENP9Z8)](https://codecov.io/gh/rubberdok/indok-web)

Website for the students at Industrial Economics and Technology Management at NTNU Trondheim. Built with Django, Next.js, and a GraphQL API. Maintained by Rubberdøk NTNU.

<p align="center">
  <a href="https://www.indokntnu.no/">
    <img alt="Landing Page" title="Indøk NTNU" src="https://github.com/rubberdok/indok-web/blob/docs/assets/Index.png" width="600">
  </a>
</p>

## Features

- 🏔 Book the luxurious cabins Oksen and Bjørnen
- 💸 Register for upcoming events and purchase tickets through Vipps
- 🎉 Find and apply for the ideal student organization at Indøk
- 🔒 Simple login through Feide
- 📝 Easily navigate through the archive of Indøk documents

## Feedback

Found a bug, got a suggestion, or something we should know about? Take a look at the [roadmap](https://github.com/orgs/rubberdok/projects/2) and
[file an issue](https://github.com/rubberdok/indok-web/issues/new) if it's not on the roadmap!

## Setup

### Installation

1. [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)

2. Install and start [Docker Desktop](https://www.docker.com/products/docker-desktop)

3. Clone the project and build the Docker images

```zsh
git clone https://github.com/rubberdok/indok-web.git
cd indok-web
docker compose build
```

4. Run the project in Docker and set up the database

```zsh
docker compose up
docker compose exec backend python manage.py loaddata initial_data
```

The last command creates some initial data, two test users, and one admin user:

| Username      | Password | Indøk |
| ------------- | :------: | ----: |
| eva_student   |   5tgb   |  true |
| asbjorn_elevg |   1qaz   | false |
| admin         | admin123 | super |

- Accessing the test users

  - Log in with Feide > Feide Test Users (under "Other login alternatives")

  - Enter the respective username and password.

5. Install pre-commit hooks and Node dependencies locally for linting
   - If you already have `yarn` installed, skip to step 4.
   1. Install `nvm` by following the [instructions](https://github.com/nvm-sh/nvm#installing-and-updating)
   2. Install Node 16
   ```zsh
   nvm install 16
   nvm use 16
   ```
   3. Install `yarn`
   ```zsh
   npm i -g yarn
   ```
   4. Install pre-commit hooks and dependencies locally
   ```zsh
   cd frontend
   yarn
   ```
6. Install Python dependencies locally for linting
   1. Install [Python 3.9](https://www.python.org/downloads/release/python-397/)
   2. (Optional, but recommended) Create a virtual environment in the root folder `indok-web`
   ```zsh
   python -m venv .venv
   source .venv/bin/activate
   ```
   3. Install Python dependencies locally
   ```zsh
   pip install -r backend/requirements/local.txt
   ```

The frontend runs on [http://localhost:3000](http://localhost:3000), and the backend on [http://localhost:8000](http://localhost:8000). The GraphQL API endpoint is [http://localhost:8000/graphql](http://localhost:8000/graphql). The admin panel is available at [http://localhost:8000/admin](http://localhost:8000/admin).

### Secrets

Environment variables are automatically loaded, but secrets are not stored in the repository.

1. Create `.env` and `.env.local` in `backend/` and `frontend/`, respectively.
2. Contact maintainers in order to get the necessary secrets, alternatively, if you're a member of Rubberdøk, check the #dev channel on Slack.
3. Make sure to restart either container after making changes to `.env*`

## Error logging

The project has error logging through [Sentry](sentry.io), and can be accessed by authenticating with Github SSO.

## Contributing

See [CONTRIBUTING](CONTRIBUDING.md).

## Deployment

The app is deployed through AWS ECS.

## Other Services

- E2E testing through [Cypress](cypress.io), publicly accessible.
- Code coverage through [Codecov](codecov.io), accessible with Github SSO.
- Domains managed through [domene.shop](domene.shop).
- [Postmark](postmarkapp.com) as e-mail service, contact an administrator for access.
- [Vipps](portal.vipps.no), contact an administrator for access.
- [Feide](kunde.feide.no), contact an administrator for access.
- [AWS](https://rubberdok.signin.aws.amazon.com/console/) for various services, contact an administrator for access.
- [Google Workspace](admin.google.com) for account management, contact an administrator for access.
- [Slack](slack.com) for communication, available with a [rubberdok.no](rubberdok.no) domain.

## Acknowledgements

<p float="left">
  <a href="https://github.com/Skraagen">
    <img alt="Skraagen" src="https://avatars1.githubusercontent.com/u/18050179?s=400&v=4" width="14">
  </a>
  Logo created by Skraagen 🦆
</p>

[indokntnu.no](https://www.indokntnu.no) is powered by:

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
    <img alt="NextJS" src="https://github.com/rubberdok/indok-web/blob/docs/assets/nextjs_logo.svg" height="50">
  </a>
  &nbsp;
  <a href="https://www.typescriptlang.org/">
    <img alt="TypeScript" src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" height="50">
  </a>
  &nbsp;
  <a href="https://www.python.org">
    <img alt="Python" src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" height="50">
  </a>
  &nbsp;
  <a href="https://www.djangoproject.com">
    <img alt="Django" src="https://github.com/rubberdok/indok-web/blob/docs/assets/django_logo.svg" height="50">
  </a>
  &nbsp;
  <a href="https://www.docker.com">
    <img alt="Docker" src="https://www.docker.com/sites/default/files/d8/styles/role_icon/public/2019-07/vertical-logo-monochromatic.png?itok=erja9lKc" height="50">
  </a>
  &nbsp;
  <a href="https://aws.amazon.com/">
    <img src="https://github.com/rubberdok/indok-web/blob/docs/assets/aws_logo.svg" alt="Powered by AWS Cloud Computing", height="50">
  </a>
</p>
