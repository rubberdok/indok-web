# Larger base image for development
FROM --platform=linux/amd64 node:16.13.2

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 1000000000

COPY . .

ENV NEXT_PUBLIC_APP_ENV development

EXPOSE 3000

# Disable NextJS telemetry
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "dev"]
