FROM ubuntu:14.04
MAINTAINER Kevin Glinski <kevin.glinski@inin.com>
RUN apt-get update && apt-get install -y ruby ruby-dev

RUN gem install bundler

RUN mkdir /hired_or_fired
WORKDIR /hired_or_fired

ADD web /hired_or_fired

RUN bundle install

EXPOSE 5000
CMD ["bundle", "exec", "rackup", "--host", "0.0.0.0", "-p", "5000"]
