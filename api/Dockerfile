FROM node:lts-alpine as deps

RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

FROM node:lts-alpine as runner
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

CMD ["npm", "run", "dev"]