FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN apk add --no-cache tzdata
RUN yarn install --frozen-lockfile --production

COPY index.js ./
COPY src ./src

EXPOSE 8081
