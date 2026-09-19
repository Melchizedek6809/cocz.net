### Builder

FROM debian:trixie-slim as builder
WORKDIR /app

RUN apt-get -y update && apt-get install -y --no-install-recommends guile-3.0 make guile-commonmark
COPY ./ ./
RUN make all

### Nginx Server

FROM alpinelinux/darkhttpd
COPY --from=builder /app/dist /var/www/localhost/htdocs/