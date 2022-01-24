FROM cypress/browsers:node14.17.0-chrome91-ff89

WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

COPY . .

ENTRYPOINT [ "yarn", "e2e:headless" ]
