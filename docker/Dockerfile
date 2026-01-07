# syntax=docker/dockerfile:1
FROM caddy:2-builder-alpine as builder

# always build the latest Caddy version with plugins
ARG CADDY_VERSION=latest

RUN xcaddy build ${CADDY_VERSION} \
  --with github.com/caddy-dns/cloudflare \
  --with github.com/caddy-dns/desec \
  --with github.com/ss098/certmagic-s3

FROM caddy:alpine

COPY --from=builder /usr/bin/caddy /usr/bin/caddy

WORKDIR /var/lib/caddy
COPY pages /var/lib/caddy/pages

EXPOSE 80 443
ENTRYPOINT [ "caddy" ]
CMD [ "run", "--config", "/etc/caddy/Caddyfile", "--watch", "--resume" ]
