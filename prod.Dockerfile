FROM node:13.8-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN apk update && \
    apk upgrade && \
    apk add g++ gcc libgcc libstdc++ linux-headers make cmake python
RUN npm ci
COPY . .
RUN npm run client:build:production

FROM node:13.8-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
COPY . .
COPY --from=builder /app/public ./public

CMD npm run dotenv:bot
