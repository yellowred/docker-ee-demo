FROM node:8.2.1

RUN apt-get -yqq update && \
    apt-get -y install net-tools && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV APP_DIR=/srv/data_api

COPY package.json /tmp/package.json
RUN \
    cd /tmp && \
    npm install --production && \
    npm cache verify

# Application setup
RUN \
  mkdir ${APP_DIR} && \
  mkdir ${APP_DIR}/log && \
  cp -a /tmp/node_modules/ ${APP_DIR}

COPY client ${APP_DIR}/client
COPY common ${APP_DIR}/common
COPY server ${APP_DIR}/server
COPY package.json ${APP_DIR}/package.json

RUN chown -R www-data.www-data ${APP_DIR}

USER www-data

WORKDIR ${APP_DIR}

EXPOSE 8080

ENTRYPOINT ["npm"]
CMD ["start"]