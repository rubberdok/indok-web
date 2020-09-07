FROM node:12

# Create app directory
RUN mkdir -p /code/frontend/
WORKDIR /code/frontend

# Installing dependencies
COPY frontend/package.json ./
RUN npm install

# Copying source files
COPY frontend .

