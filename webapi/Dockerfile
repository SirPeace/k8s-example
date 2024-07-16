FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm i
COPY src src
EXPOSE $PORT
ENTRYPOINT [ "npm", "start" ]