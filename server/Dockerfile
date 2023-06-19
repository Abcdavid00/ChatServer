FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
COPY index.js ./
COPY src ./src

RUN apk add --no-cache tzdata
RUN yarn install --frozen-lockfile --production

EXPOSE 8081
