FROM node:carbon

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
RUN mkdir ./repo/

RUN git clone --mirror https://github.com/jmurphyau/ember-truth-helpers.git ./repo/


CMD [ "npm", "run", "start" ]