### Builder

FROM debian:trixie-slim as builder
WORKDIR /app

RUN apt-get -y update && apt-get install -y --no-install-recommends guile-3.0 make guile-commonmark
COPY ./ ./
RUN make all

### Nginx Server

FROM nginx:1-alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist /usr/share/nginx/html