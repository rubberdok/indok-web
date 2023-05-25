# Local Development Setup and Workflow

## Table of Contents

- [Preface](#preface)
- [Preqreuisites](#prerequisites)
  - [Python](#python)
  - [Node.js](#nodejs)
- [Visual Studio Code](#visual-studio-code-vscode)
  - [Shell Command](#shell-command)
  - [Extensions](#extensions)
- [Workflows / Frequently Asked Questions](#workflows--frequently-asked-questions)

## Preface

This document is intended to be a guide for setting up a local development environment for the project in order to
enable autocompletion, linting, and testing. Furthermore, it also serves as a guide for common workflows when working on the project.

It is **not** intended to replace the documentation for the tools used in the project. The vast majority of the tools used in this project are _very well documented_, and actively using the documentation for these tools is an excellent way of understanding and resolving issues. The documentation for the most important tools can be found here:

While reading documentation may seem daunting and boring at first, I promise that it is an extremely effective tool and an important skill, so it is worthwhile to learn it.

- Django: https://docs.djangoproject.com/en/3.2/
- React: https://react.dev
  - Honorable mentions:
    - https://react.dev/learn/managing-state
    - https://react.dev/learn/you-might-not-need-an-effect
- Next.js: https://nextjs.org/docs
- Material UI: https://mui.com/material-ui/getting-started/overview/
- Apollo Client: https://www.apollographql.com/docs/react/

The document assumes that the reader has completed the [Project Installation](https://github.com/rubberdok/indok-web/wiki/Project-Installation). Otherwise,
complete the [Project Installation](https://github.com/rubberdok/indok-web/wiki/Project-Installation) before returning to this document.

## Prerequisites

### Python

Installing the Python dependencies locally enables linting and autocompletion in VSCode, making the local development significantly easier. There are many ways to accomplish this (e.g. devcontainers), but we're just outlining one way to do it here.

#### MacOS/Unix-like

<details>
<summary>Click to expand</summary>

1. Install [pyenv](https://github.com/pyenv/pyenv), a Python version manager

   ```shell
   $ brew install pyenv
   ```

2. Install and use the latest version of Python 3.9

   ```shell
   $ pyenv install 3.9:latest
   $ pyenv use local 3.9:latest
   ```

3. Set up and activate a virtual environment

   ```shell
   $ python -m venv .venv
   $ source .venv/bin/activate
   ```

4. Install dependencies locally
`shell
    $ pip install -r backend/requirements/local.txt
    `
</details>

#### Windows

<details>
<summary>Click to expand</summary>

Please refer to steps 1-5 in [Project Installation | Server (Django) | Without Docker | Django](https://github.com/rubberdok/indok-web/wiki/Project-Installation#django).

</details>

### Node.js

Please refer to steps 1-5 in [Project Installation | Application (Next.js) | Without Docker (recommended)](https://github.com/rubberdok/indok-web/wiki/Project-Installation#without-docker-recommended)

## Visual Studio Code (VSCode)

We recommend using [Visual Studio Code](https://code.visualstudio.com). Simply install the editor and open the project folder.

### Shell Command

For MacOS users, we recommend installing the `code` shell command in PATH by opening VSCode, click `⌘ + ⇧ + P` and selecting `Shell Command: Install 'code' command in PATH`. This enables you to open files and directories in VSCode by running `code <file or directory>` in the terminal.

### Extensions

See [`.vscode/extensions.json`](.vscode/extensions.json)

### Settings

We have defined settings for the project in [`.vscode/settings.json`](.vscode/settings.json). If you for some reason want to override these settings, please change your workspace settings in VSCode.

## Workflows

### Git

Instead of maintaining our own guide for Git, it is _highly_ recommended that you read [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow). Getting comfortable with the Git flow makes it a lot easier to work on the project. Don't worry, you cannot break anything in production without merging a broken pull request to `main` (but please don't 😇). 🔨

### Docker

- Starting docker compose

  - All services:
    ```shell
    $ docker compose up
    ```
  - Specific service:
    ```shell
    $ docker compose up <service-name>
    ```
    where `<service-name>` is either `backend`, `frontend`, or `postgres`

- Executing commands in a running container
  ```shell
  $ docker compose exec <service-name> <command>
  ```
  where `<service-name>` is either `backend`, `frontend`, or `postgres` and `<command>` is the command you want to execute in the container.

### Local Users

After running `python manage.py loaddata initial_data`, you can log in to the application using the following users:

| Username      | Password | Permissions |
| ------------- | :------: | ----------: |
| eva_student   |  098asd  |       indok |
| asbjorn_elevg |  098asd  |   non-indok |
| admin         | admin123 |       super |

### Server

If you're running the server using Docker Compose, remember to prefix the commands with `docker compose exec backend`.

#### Database Migration

If you have made changes to the database models, i.e. changed fields in one of the classes in `apps/**/models.py`, you need to create a migration file. This is done by running the following commands in the terminal:

```shell
$ python manage.py makemigrations
```

Afterwards, to apply the migration:

```shell
$ python manage.py migrate
```

#### Activating a Python virtual environment

To activate the virtual environment created during the project setup, run

```shell
$ source .venv/bin/activate
```

It is also possible to set up an alias for this command in your shell configuration file (e.g. `.bashrc` or `.zshrc`). For instance:

```shell
$ echo > alias activate="source .venv/bin/activate" >> ~/.zshrc
```

Then you can run `activate` to activate the virtual environment.

### Next.js

#### Generate Typescript Types for GraphQL Queries

If you've made changes to the GraphQL schema, or you've updated a query in the frontend, you need to generate the typescript types for the queries. This is done automatically if you run `yarn dev` or `yarn build`, but you can also run it manually:

```shell
# in frontend/
$ yarn generate
```

## Frequently Asked Questions / Troubleshooting

### I get an error when running `yarn dev` or `yarn build` in the frontend

Often due to outdated or missing dependencies, run

```shell
# in frontend/
$ yarn
```

to install and update dependencies, then run

```shell
# in frontend/
$ yarn dev
```

again.

### I'm running the server in Docker and something is not working

In increasing order of nuking power:

Stopping the containers and clearing the volumes

```shell
$ docker compose down -v
```

Nuking absolutely every image, volume, and container on your system

```shell
$ docker system prune --volumes -a
```

### I added a new field to a model in Django, what do I do to access it frontend?

1. Create and apply a migration, see [Database Migration](#database-migration)
2. In `backend/apps/<your-app>/types.py`, add the field to the `fields` list in the meta class. For instance:
   ```python
   class MyType(DjangoObjectType):
       class Meta:
           fields = [
               ...,
               my_new_field
           ]
   ```
3. Update the GraphQL schema by running
   ```shell
   $ python manage.py graphql_schema
   ```
4. In `frontend/`, update the query where you want to include the field. For instance, in `frontend/src/graphql/my-app/queries.graphql`:

   ```graphql
   query myQuery {
     myQuery {
       id
       ...myNewField
     }
   }
   ```

5. Generate Typescript types based on the GraphQL schema, see [Generate Typescript Types for GraphQL Queries](#generate-typescript-types-for-graphql-queries).

6. You can now access the newly added field with the correct types wherever you're calling the query.

### I opened a pull request, but the status checks are failing!

The vast majority of the time, it's because something in the code is wrong. Click on the status check, find the error, and try to interpret why it is occuring, then fix the issue.
