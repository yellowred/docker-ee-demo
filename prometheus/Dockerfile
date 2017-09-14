FROM alpine:3.6

RUN \
  apk --update upgrade && \
  apk add ca-certificates bash curl && \
  rm -rf /var/cache/apk/*

# remote build download prometheus binary
ADD https://github.com/prometheus/prometheus/releases/download/v1.7.1/prometheus-1.7.1.linux-amd64.tar.gz /tmp/prometheus-1.7.1.linux-amd64.tar.gz
# local build copy in prometheus binary (you need to download it locally)
# COPY ./prometheus-1.7.1.linux-amd64.tar.gz /tmp/prometheus-1.7.1.linux-amd64.tar.gz

RUN \
  tar zxf /tmp/prometheus-1.7.1.linux-amd64.tar.gz -C /tmp && \
  mv /tmp/prometheus-1.7.1.linux-amd64 /tmp/prometheus

# This golang script and template is for future development, when the config will need to be dynamically created
# use the golang alpine image when enabling this
# COPY ./main.go /tmp/main.go
# COPY ./prometheus.tpl.yml /tmp/prometheus.tpl.yml

COPY ./prometheus.yml /tmp/prometheus/prometheus.yml
RUN \
  mkdir -p /tmp/data/prometheus && \
  chmod -R 777 /tmp/data

# OpenShift RDC specific
# Unset the proxies from the BuildConfig
ENV http_proxy="" \
  https_proxy="" \
  ftp_proxy=""

EXPOSE 9090

VOLUME [ "/tmp/data" ]

WORKDIR /tmp/prometheus

CMD [ "/tmp/prometheus/prometheus", \
    "-config.file=/tmp/prometheus/prometheus.yml", \
    "-storage.local.path=/tmp/data/prometheus", \
    "-web.console.libraries=/tmp/prometheus/console_libraries", \
    "-web.console.templates=/tmp/prometheus/consoles", "-log.level=debug" ]
