FROM node:20-alpine

WORKDIR /app

COPY vue-app/package*.json ./

RUN npm install
COPY vue-app .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]