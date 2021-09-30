FROM cypress/included:8.4.1

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .

COPY cypress cypress
COPY cypress.json .

CMD ["cypress", "run"]