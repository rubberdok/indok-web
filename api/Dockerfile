FROM public.ecr.aws/docker/library/node:18-alpine as deps

RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM public.ecr.aws/docker/library/node:18-alpine as runner
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

CMD ["yarn", "dev"]