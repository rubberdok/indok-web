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
  - [With Docker](#with-docker)
  - [Without Docker](#without-docker)
    - [Frontend](#frontend)
    - [Database](#database)
    - [Backend](#backend)
- [Error Logging](#error-logging)
- [Deployment](#deployment)
- [Other Services](#other-services)
- [Acknowledgements](#acknowledgements)

## Introduction

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/rubberdok/indok-web/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/rubberdok/indok-web/actions/workflows/ci.yml)
[![Code style](https://img.shields.io/badge/code%20style-black-black?style=flat)](https://github.com/psf/black)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![codecov](https://codecov.io/gh/rubberdok/indok-web/branch/main/graph/badge.svg?token=UO2NENP9Z8)](https://codecov.io/gh/rubberdok/indok-web)

Website for the students at Industrial Economics and Technology Management at NTNU Trondheim. Built with Django, Next.js, and a GraphQL API. Maintained by Rubberdøk NTNU.

![Landing page](https://github.com/rubberdok/indok-web/blob/docs/assets/index-light.png#gh-light-mode-only)
![Landing page](https://github.com/rubberdok/indok-web/blob/docs/assets/index-dark.png#gh-dark-mode-only)

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

### With Docker

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
   python -m venv venv
   source venv/bin/activate
   ```
   3. Install Python dependencies locally
   ```zsh
   pip install -r backend/requirements/local.txt
   ```

The frontend runs on [http://localhost:3000](http://localhost:3000), and the backend on [http://localhost:8000](http://localhost:8000). The GraphQL API endpoint is [http://localhost:8000/graphql](http://localhost:8000/graphql). The admin panel is available at [http://localhost:8000/admin](http://localhost:8000/admin).

### Without Docker

Some users, particularly those using Windows, may have issues running the app through Docker. Some functionality such as
hot reloading (which drastically improves developer experience) only work when you have the whole project in WSL
(Windows Subsystem for Linux, which is what Docker on Windows uses). Therefore, you may prefer to run the project
without Docker — in that case, follow the below steps to set up the frontend, backend and database locally.

Before following the steps below, make sure to clone the project with Git:

1. In the terminal, move to where you want to store the project (easiest is just where you are when you open the
   terminal)
2. Type `git clone https://github.com/rubberdok/indok-web.git`
   - This creates a new folder named `indok-web`, which contains the project
3. Type `cd indok-web` to move into the new folder
4. If using VSCode, you can type `code .` to open the current folder in VSCode

#### Frontend

1. Download and install `nvm` (Node Version Manager): https://github.com/nvm-sh/nvm#installing-and-updating
   - If on Windows, install `nvm-windows` instead: https://github.com/coreybutler/nvm-windows/releases
     - Scroll down on that page to find `nvm-setup.exe`
   - Type `nvm --version` in a new terminal to check that it was installed correctly
2. Type `nvm install 16` in the terminal to install Node.js version 16
3. Type `nvm use 16` to use that version of Node
4. Move to the `indok-web` folder in the terminal (`cd indok-web`), then into the `frontend` folder (`cd frontend`)
5. Type `npm install -g yarn`
   - This installs Yarn, which we use to manage dependencies in the frontend
6. Type `yarn` to build the frontend
7. Type `yarn start` to run the frontend

Now the frontend should be running at `localhost:3000`! You can check it out in the web browser.

#### Database

1. Download and install PostgreSQL: https://www.postgresql.org/download/
2. Type `psql --version` in a new terminal to check that it was installed correctly

#### Backend

1. Download and install `pyenv` (Python version manager): https://github.com/pyenv/pyenv#installation
   - If on Windows, install `pyenv-win` instead: https://github.com/pyenv-win/pyenv-win#installation
   - Type `pyenv --version` in a new terminal to check that it was installed correctly
2. Type `pyenv install --list | grep "^ 3.9"` to get the list of available Python 3.9 versions
   - If on Windows, type `pyenv install --list | findstr -r "^ 3.9"` instead
3. Type `pyenv install 3.9.X`, where `X` is the latest version found from the previous step
4. Type `pyenv global 3.9.X`, where `X` is the same as the previous step
   - If you do not want to use Python 3.9 globally, type `pyenv local 3.9.X` instead (make sure you are in the
     `indok-web` folder when you do this)
   - Type `python --version` to verify that it has been set to `3.9.X`
5. Type `python -m venv venv` (make sure you are in the `indok-web` folder in the terminal when you do this!)
   - This sets up a Python virtual environment, to isolate this project from others
6. Type `source venv/bin/activate` to activate the virtual environment
   - If on Windows, type `.\venv\scripts\activate` instead
7. Type `python -m pip install -r backend/requirements/local.txt` to install dependencies
8. Type `cd backend` to move into the backend folder
9. Type `python manage.py runserver` to run the backend server
   - This requires the database to be running, so make sure to follow the steps for that above if you haven't!
10. Type `python manage.py migrate` to update the database with our backend models
11. Type `python manage.py loaddata initial_data` to load example data into the database
    - This also creates an admin user with username `admin` and password `admin123`

Now the backend should be running at `localhost:8000`! You can check out the GraphQL API at `localhost:8000/graphql`, or
use the Django admin panel at `localhost:8000/admin`.

### Secrets

Environment variables are automatically loaded, but secrets are not stored in the repository.

1. Create a file called `.env` in the `backend` folder, and a file called `.env.local` in `frontend`.
2. Contact maintainers in order to get the necessary secrets.
   - If you're a member of Rubberdøk, check the `#dev` channel on Slack.
3. When you make changes to `.env` files, make sure to restart the frontend and backend if you have them running

## Error logging

The project has error logging through [Sentry](https://sentry.io), and can be accessed by authenticating with Github SSO.

## Contributing

This project is completely open source and is intended to serve as a platform for students who are interested in web development to have a project where they can find inspiration and contribute, and as such, we gladly welcome outside contributors to the project. If you're interested in how to get started, no matter what level of experience you have, please see [CONTRIBUTING](CONTRIBUDING.md).

## Deployment

The app is deployed through AWS ECS.

## Other Services

- E2E testing through [Cypress](https://cypress.io), publicly accessible.
- Code coverage through [Codecov](https://codecov.io), accessible with Github SSO.
- Domains managed through [domene.shop](https://domene.shop).
- [Postmark](https://postmarkapp.com) as e-mail service, contact an administrator for access.
- [Vipps](https://portal.vipps.no), contact an administrator for access.
- [Feide](https://kunde.feide.no), contact an administrator for access.
- [AWS](https://rubberdok.signin.aws.amazon.com/console/) for various services, contact an administrator for access.
- [Google Workspace](https://admin.google.com) for account management, contact an administrator for access.
- [Slack](https://slack.com) for communication, available with a [rubberdok.no](rubberdok.no) domain.

## Acknowledgements

<p float="left">
  Logo created by   
  <a href="https://github.com/Skraagen">
    Skraagen
  </a>
</p>

<p float="left">
  <a href="https://vercel.com/?utm_source=rubberdok&utm_campaign=oss">
    <img
      alt="Powered by Vercel"
      title="Powered by Vercel"
      src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg"
      height="48px"
    >
  </a>
</p>
