# Larger base image for development
FROM --platform=linux/amd64 node:16.13.2

RUN mkdir -p /app

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ENV NEXT_PUBLIC_APP_ENV development

EXPOSE 3000

# Disable NextJS telemetry
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "dev"]
