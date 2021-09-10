# syntax=docker/dockerfile:1

FROM node:12

# Create app directory
RUN mkdir -p /code
WORKDIR /code

# Installing dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copying source files
COPY . .

RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
    --mount=type=secret,id=SENTRY_RELEASE \
    export SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) \
    && export SENTRY_RELEASE=$(cat /run/secrets/SENTRY_RELEASE) \
    && echo $SENTRY_AUTH_TOKEN \
    && echo $SENTRY_RELEASE \
    && npm run build

CMD ["npm", "run", "dev"]