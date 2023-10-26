<h1 align="center">Indøk NTNU</h1><br>
<p align="center">
  <a href="https://www.indokntnu.no/">
    <img alt="Logo" title="Rubberdøk" src="https://github.com/rubberdok/indok-web/blob/docs/assets/rubberdok_logo.svg" width="300">
  </a>
</p>

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Project Installation](#project-installation)
- [Local Development Setup](#local-development-setup)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
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

## Project Installation

See [Project Installation](https://github.com/rubberdok/indok-web/wiki/Project-Installation) for instructions.

## Local Development Setup

To set up linting, autocompletion, and Visual Studio Code, please refer to [Local Development Setup](https://github.com/rubberdok/indok-web/wiki/Local-Development-Setup)

## Development Workflow

See [Frequently Asked Questions](https://github.com/rubberdok/indok-web/wiki/Frequently-Asked-Questions).

## Project Structure

See [Project Structure](https://github.com/rubberdok/indok-web/wiki/Project-Structure)

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
[file an issue](https://github.com/rubberdok/indok-web/issues/new) if it's not on the roadmap.

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
