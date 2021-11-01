FROM cypress/included:8.6.0

WORKDIR /usr/src/app

COPY . .

RUN yarn install --frozen-lockfile
ENV CYPRESS_BASE_URL=http://frontend:3000
ENV CYPRESS_API_URL=http://backend:8000

CMD [ "yarn", "e2e:headless" ]
