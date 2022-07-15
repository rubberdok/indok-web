# Larger base image for development
FROM public.ecr.aws/docker/library/node:lts-alpine3.16

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 300000

COPY . .

ENV NEXT_PUBLIC_APP_ENV development

EXPOSE 3000

# Disable NextJS telemetry
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "dev"]
