FROM node:19-alpine

EXPOSE 9000

WORKDIR /notificationmicroservice

COPY . /notificationmicroservice

RUN npm install

CMD ["npm", "run", "start"]