FROM cypress/included:8.6.0

WORKDIR /usr/src/app

COPY . .

RUN yarn install --frozen-lockfile

CMD [ "yarn", "e2e:headless" ]
