FROM node:13.8-alpine

WORKDIR /app

COPY . .
RUN npm install --silent

CMD npm run run
