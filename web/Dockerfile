FROM ubuntu:14.04
MAINTAINER Hired Or Fired<hiredorfired@inin.com>

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
	nodejs \
	npm

# Copy the current directory to the container
COPY . /hired_or_fired/web

# Set our working directory from here on out
WORKDIR /hired_or_fired/web

# Install app dependencies
RUN npm install

# Expose ports 8080
EXPOSE  8080

# Start node
CMD ["nodejs", "server.js"]