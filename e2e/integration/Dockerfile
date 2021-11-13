FROM cypress/browsers:node14.17.0-chrome91-ff89

WORKDIR /usr/src/app

COPY . .

RUN yarn install --frozen-lockfile
ENV CYPRESS_BASE_URL=http://localhost:3000
ENV CYPRESS_API_URL=http://localhost:8000

CMD [ "yarn", "e2e:headless" ]
