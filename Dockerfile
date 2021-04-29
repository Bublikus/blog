FROM node:12

WORKDIR /app

COPY package*.json .

RUN npm install
RUN npm install -g knex

COPY . .

EXPOSE 5001

VOLUME [ "/app/node_modules" ]

CMD [ "npm", "start" ]
