FROM node:19-alpine

EXPOSE 9000

WORKDIR /usermicroservice

COPY . /usermicroservice

RUN npm install

CMD ["npm", "run", "start"]