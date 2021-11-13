FROM cypress/browsers:node14.17.0-chrome91-ff89

WORKDIR /usr/src/app

COPY . .

RUN yarn install --frozen-lockfile

ENTRYPOINT [ "yarn", "e2e:headless" ]
