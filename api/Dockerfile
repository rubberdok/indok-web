FROM public.ecr.aws/docker/library/node:lts-alpine3.16 as deps

RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

FROM public.ecr.aws/docker/library/node:lts-alpine3.16 as runner
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

CMD ["npm", "run", "dev"]