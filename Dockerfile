# latest official node image
FROM node:8.12.0

# base packages
RUN apt-get update && apt-get upgrade -y && apt-get install
RUN apt-get install -y libusb-1.0-0 libusb-1.0-0-dev

# process management
RUN npm i -g pm2

# use cached layer for node modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --unsafe-perm
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app/

# add project files
ADD . /usr/src/app
ADD package.json /usr/src/app/package.json
WORKDIR /usr/src/app

# run app
CMD pm2 start process.yml
