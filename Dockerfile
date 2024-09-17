FROM node:18-alpine

WORKDIR /app/vguard

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]
