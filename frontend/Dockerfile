FROM node:20-alpine

WORKDIR /app

COPY vue-app/package*.json ./
RUN npm ci

COPY vue-app .

EXPOSE 5173
