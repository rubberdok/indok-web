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

CMD ["npm", "run", "dev"]