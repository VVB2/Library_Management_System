FROM node:19-alpine

EXPOSE 5000

WORKDIR /usermicroservice

COPY . /usermicroservice

RUN npm install

CMD ["npm", "run", "dev"]