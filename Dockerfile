FROM node:8.15.0

#Create app directory
RUN mkdir -p /usr/src/backend
WORKDIR /usr/src/backend

# Install app dependencies
COPY package.json /usr/src/backend
RUN npm install

#Bundle app source
COPY . /usr/src/backend