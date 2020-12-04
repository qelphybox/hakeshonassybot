FROM node:13.8-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
COPY . .

CMD npm run bot
