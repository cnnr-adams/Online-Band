FROM node:8


# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY ./online-band/package*.json ./online-band/
RUN cd online-band && npm install
COPY . .

EXPOSE 3000
EXPOSE 443

CMD [ "npm", "run", "both"]