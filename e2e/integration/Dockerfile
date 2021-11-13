FROM cypress/browsers:node14.17.0-chrome91-ff89 as builder

WORKDIR /usr/src/app
COPY . .

RUN yarn install --frozen-lockfile

FROM cypress/browsers:node14.17.0-chrome91-ff89 as runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/cypress.json ./cypress.json
COPY --from=builder /usr/src/app/cypress.env.json ./cypress.env.json
COPY --from=builder /usr/src/app/cypress ./cypress

ENTRYPOINT [ "yarn", "e2e:headless" ]
