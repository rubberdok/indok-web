<h1 align="center">Indøk NTNU</h1><br>
<p align="center">
  <a href="https://www.indokntnu.no/">
    &nbsp;&nbsp;&nbsp;&nbsp;<img alt="Logo" title="Rubberdøk" src="../assets/logo_black.svg" width="300">
  </a>
</p>

## Table of Contents
* [Introduction](#introduction)
* [Features](#features)
* [Feedback](#feedback)
* [Setup](#setup)
* [Acknowledgements](#acknowledgements)

## Introduction
![License](https://img.shields.io/badge/license-MIT-green?style=flat)
![Code style](https://img.shields.io/badge/code%20style-black-black?style=flat)

Website for the students at Industrial Economics and Technology Management at NTNU. Built with Django, React, and GraphQL API. Built and maintained by Rubberdøk NTNU.

<p align="center">
  <a href="https://www.indokntnu.no/">
    <img alt="Landing Page" title="Indøk NTNU" src="../assets/Index.png" width="600">
  </a>
</p>

## Features
The website includes:

* Fully automated booking of cabins including payment
* View and register for upcoming events
* Apply for Indøk's student organizations
* OAuth login with Feide

## Feedback
[File an issue](https://github.com/hovedstyret/indok-web/issues/new)!

## Setup
1. Install and start [Docker Desktop](https://www.docker.com/products/docker-desktop)

2. Clone the project and build Docker image
```
git clone https://github.com/hovedstyret/indok-web.git
cd indok-web
docker-compose build
```
3. Run the project in Docker and set up the database
```
docker-compose up
docker-compose exec backend python manage.py migrate
docker-compose exec backend ptyhon manage.py createsuperuser
docker-compose exec backned python loaddata initial.json
```
4. Install commit hooks by installing the frontend locally
```
cd frontend
npm install
```

The frontend runs on [localhost:3000](localhost:3000), and the backend on [localhost:8000](localhost:8000). The GraphQL API endpoint is [localhost:8000/graphql](localhost:8000/graphql).


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
  
</p>
