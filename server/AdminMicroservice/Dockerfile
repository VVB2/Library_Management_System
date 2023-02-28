FROM node:19-alpine

EXPOSE 8000

WORKDIR /adminmicroservice

COPY . /adminmicroservice

RUN npm install

CMD ["npm", "run", "start"]