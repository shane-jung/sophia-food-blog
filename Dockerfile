# syntax=docker/dockerfile:1

FROM node:18-alpine

EXPOSE 5173 3000

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install 

COPY . .

CMD ["npm", "run", "dev"]