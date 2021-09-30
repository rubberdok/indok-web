FROM cypress/included:8.4.1

WORKDIR /usr/src/app

COPY package*.json .
RUN npm install
COPY . .
CMD ["cypress", "run"]