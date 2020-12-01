FROM node:13.8-alpine

WORKDIR /app

RUN apk update && \
    apk upgrade && \
    apk add git g++ gcc libgcc libstdc++ linux-headers make python vim
COPY . .
RUN npm install --silent

CMD npm run run
