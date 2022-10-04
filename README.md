<h1 align="center">Indøk NTNU</h1><br>
<p align="center">
  <a href="https://www.indokntnu.no/">
    <img alt="Logo" title="Rubberdøk" src="https://github.com/rubberdok/indok-web/blob/docs/assets/rubberdok_logo.svg" width="300">
  </a>
</p>

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Project Structure](#project-structure)
- [Project Setup](#project-setup)
  - [With Docker](#with-docker)
  - [Without Docker](#without-docker)
    - [Database](#database)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [VSCode](#vscode)
  - [Using test users](#using-test-users)
- [Development Workflow](#development-workflow)
- [Tech Stack](#tech-stack)
- [Error Logging](#error-logging)
- [Deployment](#deployment)
- [Other Services](#other-services)
- [Contributing](#contributing)
- [Feedback](#feedback)
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

## Project Structure

- `frontend` contains the indokntnu.no web application, written in TypeScript with React and Next.js.
  - `src` contains the source code of the frontend.
    - `pages` contains page components, where each file corresponds to a URL on the website. For example,
      `pages/about/board.tsx` is the component that is rendered at
      [indokntnu.no/about/board](https://indokntnu.no/about/board). Files/folders in \[brackets\] are variables in the
      URL, so `pages/about/organizations/[slug].tsx` gives access to the `slug` variable in that page component, which
      is e.g. `rubberdok` in [indokntnu.no/about/organizations/rubberdok](https://indokntnu.no/about/organizations/rubberdok).
    - `components` contains React components used to build up the website.
      - `pages` (under `components`) are components for specific pages. The folder structure here mirrors the folders in
        the top-level `pages`, so components for the pages in `pages/events` are in `components/pages/events`.
      - Other folders here are for components used across pages.
    - `layouts` contains React components that are part of the base website layout on every page, e.g. the navigation
      bar and footer.
    - `graphql` contains GraphQL queries and mutations that the frontend uses to talk to the backend API.
      - The folders here are grouped by backend app, so `graphql/events` contains queries/mutations for the backend app
        in `backend/apps/events`.
      - Each folder has a `queries.graphql` file for requests that only fetch data, and a `mutations.graphql` file for
        requests that change data.
        - To use a query from a `queries.graphql` file:
          - Run `yarn generate` in `indok-web/frontend` to generate data and types for the request (ending up in
            `generated/graphql.ts`).
          - At the top of the React component file where you want to use it:
            - `import { useQuery } from "@apollo/client";`
            - `import { [QUERY_NAME]Document } from "@/generated/graphql";`
          - Inside the component:
            - `const { data, loading, error } = useQuery([QUERY_NAME]Document)`
          - Now, after checking that there is no `error` or `loading`, we can use the `data`.
    - `theme` contains customizations for Material UI, the styled component library we use for React.
      - `overrides` contains customizations for specific Material UI components.
    - `lib` contains functions defined by us to make it easier to work with some of our libraries.
    - `utils` contains utility functions.
  - `.husky` configures Husky, the tool we use for pre-commit hooks (checks that run on each Git commit).
  - `content` contains files for static content used by our React components.
  - `cypress` defines our Cypress end-to-end tests, which essentially involve a robot clicking through our website to
    check that everything works as expected.
  - `public` contains public files, such as images, served by our frontend.
  - `package.json` lists the TypeScript dependencies of the project, and also defines the scripts for use by Yarn.
    Running `yarn` installs the dependencies listed here, while running e.g. `yarn dev` runs the command in
    `"scripts": ... "dev":`.
  - `.eslintrc.json` configures ESLint, our linter (a tool to enforce code standards) for TypeScript.
  - `.prettierrc` configures Prettier, the tool we use to format our TypeScript code.
  - `codegen.yml` configures `graphql-codegen`, the tool we use to generate TypeScript code from our backend's GraphQL
    API schema and the `.graphql` files we write in our frontend. This is what runs in the `yarn generate` command.
  - `tsconfig.json` configures the rules TypeScript should enforce when type checking our code.
  - `.env` files define the environment variables for the different environments of the project (development,
    production, testing).
    - To override environment variables for your local development environment, add a `.env.local` file with your
      variables. This file is ignored by Git.
- `backend` contains the backend server at api.indokntnu.no, written in Python with Django and Graphene.
  - `api/auth` contains the logic for authenticating users on their requests.
  - `apps` contains the different Django apps (essentially modules) for the backend. Each app follows this structure (or
    at least parts of it):
    - `fixtures` contains example data for local development, loaded through `python manage.py loaddata initial_data`.
    - `migrations` contains Django files for _migrating_ (updating) the database after every change to a Django model in
      the app. Most of these are generated through the `python manage.py makemigrations` command, though some are
      custom-written for more complex updates of the database. The code in these files is what runs when you do
      `python manage.py migrate`.
    - `admin.py` configures what parts of the app should be shown in the Django admin panel.
    - `apps.py` configures the app.
    - `constants.py` contains constant values used by the app.
    - `dataloader.py` contains custom logic for loading data for particular GraphQL queries (read more
      [here](https://xuorig.medium.com/the-graphql-dataloader-pattern-visualized-3064a00f319f)).
    - `models.py` defines the Django models of the app, which is how objects of the app are stored in the database.
    - `mutations.py` defines classes for each GraphQL mutation in the app's API (GraphQL requests that change data),
      and their arguments.
    - `resolvers.py` defines methods for resolving each GraphQL query in the app's API (GraphQL requests that only fetch
      data).
    - `schema.py` defines the GraphQL schema for the app's API. It imports the mutations and query resolvers from
      `mutations.py` and `resolvers.py`, and defines the types for the queries.
    - `signals.py` contains Django signals, which are functions that run on a specific trigger (e.g. when an object of a
      particular model is saved to the database).
    - `tests.py` contains tests of the app's logic.
    - `types.py` defines the GraphQL API types for models in the app. You can think of a _type_ in this context as how
      an object is represented in our API (to our frontend), while a _model_ is how it is represented in the database.
      An API type typically inherits from Graphene's `DjangoObjectType` and bases itself on the fields of its
      corresponding Django model. However, it can also add custom fields that are not on the database model, in which
      case it defines a `resolve_[field_name]` on the type with the logic for resolving that field.
  - `config` configures the Django project, and ties together the different apps.
    - `settings` contains Django settings for the project.
      - `base.py` has settings for every version of the project.
      - `local.py` has settings for local development of the project.
      - `production.py` has settings for the production environment (the live website) of the project.
    - `urls` defines the URL endpoints of the backend server. It follows the same file structure as `settings`.
    - `schema.py` defines the GraphQL schema for the whole API of the backend. It simply imports each app's schema from
      their `schema.py` files, and combines them.
  - `decorators` defines our custom Python decorators, which are the functions used with the `@` syntax.
  - `entrypoints` contains scripts for running the backend, used by Docker and our Continuous Integration pipelines.
  - `requirements` list the Python dependencies of our project, to make it easier to install with e.g.
    `pip install -r requirements/local.txt`.
    - `base.txt` contains the main dependencies for all versions of the project.
    - `local.txt` includes our Python formatter and linter for development.
    - `production.txt` includes a library for logging production errors to Sentry, our error logging service.
  - `static` contains static content served by our backend.
  - `templates` contains Django templates, which is HTML but with slots for inserting values in Python.
  - `utils` contains shared utility classes and functions for use by our backend.
  - `schema.json` is a JSON representation of the backend's GraphQL API schema defined in our `schema.py` files. It is
    generated with the `python manage.py graphql_schema` command, and can then be used by our frontend to generate
    TypeScript code for interacting with our API. So you can essentially think of `schema.json` as a language-agnostic
    "translation step" for letting the TypeScript frontend use the API types from our Python backend.
  - `mypy.ini` configures MyPy, a type checker for Python.
  - `pyproject.toml` configures Black, the tool we use to format our Python code.
  - `tox.ini` configures flake8, our linter (a tool to enforce code standards) for Python.
  - `.env` files contain the environment variables for the different environments of the project (development,
    production, testing).
    - To override environment variables for your local development environment, add a `.env` file with your variables.
      This file is ignored by Git.
- `.gitignore` tells Git which files should not be included in the repository (these are grayed out in VSCode's file
  explorer).
- `docker-compose.yml` configures the Docker containers that can be run with the `docker compose` command. Our frontend
  and backend also have a `Dockerfile` each for configuring their Docker containers.

## Project Setup

[With Docker](#with-docker) below describes how to set up the project fully in Docker. This may not work perfectly for
everyone, particularly those using Windows - they may instead wish to follow the steps under
[Without Docker](#without-docker). Finally, [VSCode](#vscode) describes how to configure your development environment in
the VSCode editor.

### With Docker

1. Download, install and start Docker Desktop: https://www.docker.com/products/docker-desktop
2. In the terminal, move to where you want to store the project (easiest is just where you are when you open the
   terminal)
3. Type `git clone https://github.com/rubberdok/indok-web.git`
   - This creates a new folder named `indok-web`, which contains the project
4. Type `cd indok-web` to move into the new folder
5. (optional, but recommended) Set up the backend locally, to get linting, auto-complete and environment variables
   - Follow steps 1-9 under [Without Docker: Backend](#backend) below
6. (optional, but recommended) Set up the frontend locally, to get pre-commit hooks, linting, auto-complete and
   environment variables
   - Follow steps 1-8 under [Without Docker: Frontend](#frontend) below
7. Type `docker compose build` to build the project
8. Type `docker compose up` to run the frontend, backend and database
9. Open a new terminal, and navigate back to `indok-web`
10. Type `docker compose exec backend python manage.py migrate` to update the database
11. Type `docker compose exec backend python manage.py loaddata initial_data` to load example data into the database
    - Only works if you followed the backend env setup from step 5

The frontend runs on [http://localhost:3000](http://localhost:3000), and the backend on
[http://localhost:8000](http://localhost:8000). The GraphQL API endpoint is
[http://localhost:8000/graphql](http://localhost:8000/graphql), and the Django panel is at
[http://localhost:8000/admin](http://localhost:8000/admin).

If you want to close the app, press `Ctrl + C` in the terminal running Docker, or type `docker compose down` inside the
`indok-web` folder in another terminal. To start the app again, type `docker compose up`, also in the
`indok-web` folder (and make sure Docker Desktop is running!). If you want to clear the database, go to the `Volumes`
tab in Docker Desktop, and delete `indok-web_postgres_data`.

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

#### Database

The project uses PostgreSQL as its database. Even when running the frontend and backend outside of Docker, we still
recommend running Postgres through Docker, since you don't need hot reloading there and it makes the setup simpler.

To set up PostgreSQL in Docker, follow these steps:

1. Download, install and start Docker Desktop: https://www.docker.com/products/docker-desktop
2. Open the `indok-web` folder in VSCode
3. Make a new file called `.env` inside `backend`
4. Paste the following line in that file, and save:

```
DB_HOST=localhost
```

5. Navigate to `indok-web` in the terminal (`cd indok-web`)
6. Type `docker compose up postgres`

Now Postgres should be up and running! Leave the terminal window open to keep the database running in the background.

If you want to close the database, press `Ctrl + C` in the terminal running Postgres, or type `docker compose down`
inside the `indok-web` folder in another terminal. To start Postgres again, type `docker compose up postgres`, also in
the `indok-web` folder (and make sure Docker Desktop is running!). If you want to clear the database, go to the
`Volumes` tab in Docker Desktop, and delete `indok-web_postgres_data`.

If you still want to run Postgres without Docker, download and install it from here instead: https://www.postgresql.org/download/. Then follow steps 2-4 as above.

#### Backend

1. Download and install `pyenv` (Python version manager): https://github.com/pyenv/pyenv#installation
   - If on Windows, install `pyenv-win` instead: https://github.com/pyenv-win/pyenv-win#installation
   - Type `pyenv --version` in a new terminal to check that it was installed correctly
2. Type `pyenv install --list | grep " 3.9"` to get the list of available Python 3.9 versions
   - If on Windows, type `pyenv install --list | findstr " 3.9"` instead
3. Type `pyenv install 3.9.X`, where `X` is the latest version found from the previous step
4. Type `pyenv global 3.9.X`, where `X` is the same as the previous step
   - If you do not want to use Python 3.9 globally, type `pyenv local 3.9.X` instead (make sure you are in the
     `indok-web` folder when you do this)
   - Type `python --version` to verify that it has been set to `3.9.X`
5. Type `cd indok-web` to move into the project folder (if you weren't already there)
6. Type `python -m venv venv`
   - This sets up a Python virtual environment, to isolate this project from others
7. Type `source venv/bin/activate` to activate the virtual environment
   - If on Windows, type `.\venv\scripts\activate` instead
8. Type `cd backend` to move into the `backend` folder
9. Type `python -m pip install -r requirements/local.txt` to install dependencies
   - If on Windows, also install the GTK3 runtime from the `.exe` here:
     https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer/releases (one of the Python libraries we
     use depends on this)
10. Ask the project maintainers for dev environment variables (not strictly required, but step 14 will not work without this)
    - If you're a member of Rubberdøk:
      - Go to the `#dev` channel in Slack
      - Find the pinned post with dev environment variables
      - Copy the variables for `backend/.env` into your own `.env` file in `indok-web/backend` (make sure not to
        overwrite the `DB_HOST` variable from the database setup)
11. Set the environment variable `DJANGO_READ_DOT_ENV_FILE` to `true`
    - On Mac/Linux:
      - Type `code ~/.zshrc` to open the `zsh` config in VSCode
        - If `code` doesn't work, try `open ~/.zshrc` to open it in another text editor
      - Paste this line somewhere in that file: `export DJANGO_READ_DOT_ENV_FILE=true`
      - Save the file, and re-open the terminal
    - On Windows (with the PowerShell terminal):
      - Type `code $profile` to open the PowerShell config in VSCode
        - If `code` doesn't work, type `echo $profile` and open that file in some other text editor
      - Paste this line somewhere in that file: `$env:DJANGO_READ_DOT_ENV_FILE = "true"`
      - Save the file, and re-open PowerShell
12. Type `python manage.py runserver` to run the backend server
    - If it fails, make sure that you:
      - are in the `indok-web/backend` folder
      - have your virtual environment active
      - have the database running
13. Open a new terminal (leave the previous terminal open to keep the server running!)
    - Type `cd indok-web` to move into `indok-web` (or `cd ..` if you were put in `indok-web/backend`)
    - Type `source venv/bin/activate` (Mac) or `.\venv\scripts\activate` (Windows) to re-activate the virtual
      environment in this new terminal
    - Type `cd backend` to get back to the backend folder
14. Type `python manage.py migrate` to update the database with our backend models
15. Type `python manage.py loaddata initial_data` to load example data into the database
    - This also creates an admin user with username `admin` and password `admin123`

Now the backend should be running at `localhost:8000`! You can check out the GraphQL API at `localhost:8000/graphql`, or
use the Django admin panel at `localhost:8000/admin` (log in with the admin user from step 14).

If you want to close the backend, press `Ctrl + C` in the terminal where it runs. To start it again:

1. Move into the `indok-web` folder (`cd indok-web`)
2. Activate your virtual environment
   - On Mac: `source venv/bin/activate`
   - On Windows: `.\venv\scripts\activate`
3. Move into the backend folder (`cd backend`)
4. Type `python manage.py runserver`
5. If you need to run migrations:
   - Open a new terminal, and repeat steps 1-3
   - If you've made changes to Django models and want to generate new migrations: `python manage.py makemigrations`
   - Run migrations with `python manage.py migrate`

#### Frontend

1. Download and install `nvm` (Node Version Manager): https://github.com/nvm-sh/nvm#installing-and-updating
   - If on Windows, install `nvm-windows` instead: https://github.com/coreybutler/nvm-windows/releases
     - Scroll down on that page to find `nvm-setup.exe`, and download it
     - Open the terminal **as administrator** (`PowerShell`/`Command Prompt`/`Windows Terminal`)
     - Use `cd` to navigate to where you downloaded the `.exe` file (e.g. `cd downloads`)
     - Type `.\nvm-setup.exe`, and go through the installer
   - Type `nvm version` in a new terminal to check that it was installed correctly
2. Type `nvm install 16` in the terminal to install Node.js version 16
3. Type `nvm use 16.X.Y`, where `16.X.Y` is the version shown in the terminal after running the previous command
   - If on Windows, you may have to run the terminal as administrator
4. Open the `indok-web` folder in VSCode, and create a file called `.env.local`
5. Ask the project maintainers for dev environment variables
   - If you're a member of Rubberdøk:
     - Go to the `#dev` channel in Slack
     - Find the pinned post with dev environment variables
     - Copy the variables for `frontend/.env.local` into your own `.env.local` file in `indok-web/backend`
6. Type `cd indok-web/frontend` to move into the frontend folder (or just `cd frontend` if you were already in indok-web)
7. Type `npm install -g yarn`
   - This installs Yarn, which we use to manage dependencies in the frontend
8. Type `yarn` to fetch dependencies
9. Type `yarn dev` to run the frontend

Now the frontend should be running at `localhost:3000`! You can check it out in the web browser.

If you want to close the frontend, press `Ctrl + C` in the terminal where it runs. To start it again, type `yarn dev`
inside `indok-web/frontend` (if dependencies have changed, you may have to run `yarn` first).

### VSCode

First of all, we recommend installing the following extensions:

- [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Next, open the `indok-web` folder in VSCode, create a folder called `.vscode` at the top level, and a `settings.json`
file inside that. Paste the following in it:

```
{
  // Sets VSCode to auto-format files when saving
  "editor.formatOnSave": true,

  // Configures Prettier, our formatter for TypeScript
  "[html][css][json][jsonc][yaml][javascript][javascriptreact][typescript][typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // Configures Black, our formatter for Python
  "python.formatting.provider": "black",
  "python.formatting.blackArgs": ["--config=backend/pyproject.toml"],

  // Configures flake8, our linter for Python
  "python.linting.flake8Enabled": true,
  "python.linting.flake8Args": ["--config=backend/tox.ini"],

  // Allows the Python VSCode extension to suggest correct auto-import paths when having the project open in indok-web
  "python.analysis.extraPaths": ["backend"]
}
```

Finally, if you're on Mac, we recommend pressing `Cmd + Shift + P`, searching for "shell command", and clicking
`Shell Command: Install 'code' command in PATH`. This lets you open your current folder in the terminal, using `code .`.

### Using test users

The `python manage.py loaddata initial_data` command used in the setup above sets up one admin user and two test users:

| Username      | Password | Indøk |
| ------------- | :------: | ----: |
| eva_student   |   5tgb   |  true |
| asbjorn_elevg |   1qaz   | false |
| admin         | admin123 | super |

To log in as one of these test users when testing out the frontend locally, click "Other login alternatives" on the
Feide login screen, then "Feide Test Users".

## Development Workflow

An outline of how a developer may work with this project:

- Move to `indok-web` in the terminal (`cd indok-web`)
- If you are on the `main` branch, pull the latest updates
  - In the terminal:
    - Type `git status` to see which branch you are on
    - If you're not on the `main` branch but want to move back to it, type `git checkout main`
    - Type `git pull` to get the latest updates
  - In VSCode:
    - Check which branch you are on in the bottom left corner of the window
      - To change branch, click it and select e.g. `main`
    - Go to the Source Control tab on the left
    - Click `...` -> `Pull`
- Run the frontend, backend and database
  - With Docker:
    - Have Docker Desktop open, and type `docker compose up` inside `indok-web`
      - You may sometimes have to do `docker compose build` first
    - If the backend complains about unapplied migrations:
      - Open a new terminal in `indok-web`
      - Type `docker compose exec backend python manage.py migrate`
  - Without Docker (one terminal for each, in the `indok-web` folder):
    - Database (still with Docker):
      - Type `docker compose up postgres`
    - Backend:
      - Activate your Python virtual environment
        - Mac: type `source venv/bin/activate`
        - Windows: type `.\venv\scripts\activate`
        - If you've followed the steps in the `#dev` channel in the Rubberdøk Slack: simply type `venv`
      - Type `cd backend` to move into the backend folder
      - Type `python manage.py runserver`
      - If it says you have unapplied migrations:
        - Open a new terminal in `indok-web`, activate your virtual environment again, then `cd backend`
        - Type `python manage.py migrate`
      - If it complains about missing dependencies:
        - Close the server (`Ctrl + C`)
        - Type `pip install -r requirements/local.txt` to install dependencies
        - Type `python manage.py runserver` again
    - Frontend:
      - Type `cd frontend` to move into the frontend folder
      - Type `yarn dev` to start the app
      - If it complains about missing dependencies:
        - Close the app (`Ctrl + C`)
        - Type `yarn` to install dependencies
        - Type `yarn dev` again
- Open another terminal, and move back to `indok-web`
- Open the project in VSCode, or your favorite code editor
  - Type `code .` to open the current terminal folder in VSCode
- Create a new Git branch for your changes
  - In the terminal:
    - Type `git checkout -b add-example-feature` to create a new Git branch called `add-example-feature`
      - Replace this name with a short, descriptive name for your branch!
  - In VSCode:
    - Click the branch name in the bottom left of the window, then `Create new branch...`
- Make your changes to the code!
  - If you want to update a page on the website:
    - Navigate to the file in `frontend/src/pages` that matches the URL of the page you want to update
      - For example, `pages/events/index.tsx` is the page component for
        [indokntnu.no/events](https://indokntnu.no/events)
    - Update the page component as you wish
      - If what you want to change is not shown in the page component, it's probably in a sub-component
        - Sub-components for a specific page are in `frontend/src/components/pages/...`
          - For example, components for event pages are in `components/pages/events`
        - In VSCode, you can move to a sub-component on a page by right-clicking it in the HTML of the page component,
          and clicking `Go to Definition`
  - If you want to add/update a GraphQL query/mutation to fetch/change data from the backend:
    - Find the `queries.graphql` / `mutations.graphql` file in the appropriate feature folder under
      `frontend/src/graphql`
    - Add/change your query/mutation
    - Generate TypeScript code for your query/mutation
      - `cd` into `frontend`, and type `yarn generate`
  - If you want to add/change a field on a backend database model:
    - Change the model class in the `models.py` file, in the appropriate feature folder under `backend/apps`
    - Generate a Django migration to update the database
      - `cd` into `backend`, and type `python manage.py makemigrations` (with your virtual environment activated!)
      - Update your local database with `python manage.py migrate`
        - If running the backend through Docker: type `docker compose exec backend python manage.py migrate` instead
  - If you want to add/change a field on a type in the GraphQL API:
    - Change the type class in the `types.py` file, in the appropriate feature folder under `backend/apps`
    - If it's a new field from the type's Django model:
      - Simply add the field name in the `fields` list on the type's `Meta` class
    - If it's a field that only exists on the API type, but not on the database model:
      - Add `field_name = graphene.FieldType()` under the class name, replacing `field_name` and `FieldType` with the
        appropriate name and type for your field
      - Add a method `resolve_field_name` with the `@staticmethod` decorator on the class, with the logic for how to
        get data for the field
    - Re-generate the backend's `schema.json`
      - `cd` into `backend`, and type `python manage.py graphql_schema` (with your virtual environment activated!)
  - If you want to add/change a query (to fetch data) or mutation (to change data) in the GraphQL API:
    - Find the query resolver method in `resolvers.py`, or the mutation class in `mutations.py`, in the appropriate
      feature folder under `backend/apps`
      - Examples:
        - The resolver for the `allOrganizations` query is the `resolve_all_organizations` method on the
          `OrganizationResolvers` class in `backend/apps/organizations/resolvers.py`
        - The `createOrganization` mutation corresponds to the `CreateOrganization` class in
          `backend/apps/organizations/mutations.py`, with an `OrganizationInput` class for its arguments, and a `mutate`
          method for the actual mutation logic
    - Add/change your query resolver method or mutation class
    - If you added a new query/mutation, update the `schema.py` file in the same folder to expose it through the API:
      - For a query: add a new field for the query in the `...Queries` class, with the appropriate `graphene` type for
        what the query returns
      - For a mutation: import `YourMutation` class from `.mutations`, and add `your_mutation = YourMutation.Field()` to
        the `...Mutations` class (obviously replacing `your_mutation` / `YourMutation` with the name of your mutation)
    - Re-generate the backend's `schema.json`
      - `cd` into `backend`, and type `python manage.py graphql_schema` (with your virtual environment activated!)
- Commit your changes to Git
  - If your changes are large, consider splitting it up into different commits for different files
  - In the terminal:
    - Type `git status` to see which files you have changed
    - If you want to add them all, type `git add .` from `indok-web`
      - Otherwise, you can do `git add` followed by the path of the specific file you want to add
    - Type `git commit -m "add example component for example feature"`
      - Replace the message here with your own short, descriptive message describing the changes!
      - Git commit messages should be written in imperative, e.g. `add` rather than `adds` / `added`
  - In VSCode:
    - Go to the Source Control tab on the left
    - Click `+` on the files you want to add to the commit
    - Write a commit message in the text box, then click `Commit`
  - If it complains about missing `black` / `flake8`:
    - This is because we have configured "pre-commit hooks" to format and lint your code on commit
    - Since `black` and `flake8` are part of your Python virtual environment, you have to activate your virtual
      environment for these to work
      - In the terminal, type `source venv/bin/activate` (Mac) / `.\venv\scripts\activate` (Windows) / `venv` (from
        Rubberdøk Slack)
      - If committing through the terminal, just run `git commit` again after this
      - If committing through VSCode, you may have to restart VSCode from the terminal to use your virtual environment
        (`code .`)
  - If you get errors from pre-commit hooks, look through the error message to see what you have to fix
- Push your branch to GitHub
  - In the terminal:
    - Type `git push -u origin add-example-feature`, replacing `add-example-feature` with your branch name
  - In VSCode:
    - Go to the Source Control tab on the left
    - Click `...` -> `Push`
      - If it asks if you want to publish your branch, click `OK`
- Make a Pull Request on GitHub
  - Go to [github.com/rubberdok/indok-web/branches](https://github.com/rubberdok/indok-web/branches)
  - Click `New Pull Request` on your branch
  - Write a concise, but descriptive summary of your changes
  - Request a review from another developer
  - Respond to any questions or concerns they may have with your Pull Request
  - If an automatic test fails, click `Details` on it to see what went wrong in the logs
  - Once your Pull Request is approved, and the tests pass, you can merge it - now your changes are live!

## Tech Stack

- Frontend
  - TypeScript (programming language, "JavaScript with types")
    - Docs: https://www.typescriptlang.org/docs/
  - React (library for building UI with components)
    - Docs: https://beta.reactjs.org/learn
  - Next.js (framework for structuring and server-side rendering React apps)
    - Docs: https://nextjs.org/docs
  - Apollo Client (library for handling GraphQL requests in the frontend)
    - Docs: https://www.apollographql.com/docs/react/
- Backend
  - Python (programming language)
    - Docs: https://docs.python.org/3.9/tutorial/index.html
  - Django (web framework)
    - Docs: https://docs.djangoproject.com/en/3.2/
  - Graphene (library for building GraphQL APIs)
    - Docs: https://docs.graphene-python.org/en/latest/
    - Graphene-Django docs (the integration we use for Django): https://docs.graphene-python.org/projects/django/en/latest/

## Error logging

The project has error logging through [Sentry](https://sentry.io), and can be accessed by logging in with GitHub.

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

## Contributing

This project is completely open source and is intended to serve as a platform for students who are interested in web
development to have a project where they can find inspiration and contribute, and as such, we gladly welcome outside
contributors to the project. If you're interested in how to get started, no matter what level of experience you have,
please see [CONTRIBUTING](CONTRIBUDING.md).

## Feedback

Found a bug, got a suggestion, or something we should know about? Take a look at the
[roadmap](https://github.com/orgs/rubberdok/projects/2) and
[file an issue](https://github.com/rubberdok/indok-web/issues/new) if it's not on the roadmap!

## Acknowledgements

<p float="left">
  Logo created by   
  <a href="https://github.com/mathiasraa">
    mathiasraa
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
