FROM cypress/included:8.6.0

WORKDIR /usr/src/app

COPY . .

RUN yarn install --frozen-lockfile
ENV CYPRESS_BASE_URL=frontend:3000

CMD [ "yarn", "e2e:headless" ]
