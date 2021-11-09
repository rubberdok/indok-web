# Larger base image for development
FROM --platform=linux/amd64 node:14

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ENV APP_ENV development

EXPOSE 3000

# Disable NextJS telemetry
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "dev"]
