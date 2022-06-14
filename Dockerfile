FROM node:16.14.2-alpine

WORKDIR /usr/src/app 

COPY package*.json ./

RUN npm install

# checks the Node.js process status and restarts it when the app goes down for any reason.
RUN npm install -g pm2 

COPY . ./

# Exposes the Restful service 
EXPOSE 3000 

# Exposes the Elasticsearch service
EXPOSE 9200

CMD npm run start