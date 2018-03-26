FROM node:carbon
ENV PORT=8080

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
RUN mkdir /repo

RUN git clone --mirror https://github.com/jmurphyau/ember-truth-helpers.git /repo

EXPOSE ${PORT}

CMD [ "npm", "run", "start" ]