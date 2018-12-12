FROM node:6.11.0
MAINTAINER Rajashekhar Y
RUN mkdir /user
WORKDIR /user
ADD ./package.json /user/package.json
RUN yarn install
ADD . /user