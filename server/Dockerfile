# syntax=docker/dockerfile:1
FROM node:12-alpine
WORKDIR /app
COPY package* ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]