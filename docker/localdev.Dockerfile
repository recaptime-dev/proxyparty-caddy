# syntax=docker/dockerfile:1
FROM caddy:2-builder-alpine as builder

# always build the latest Caddy version with plugins
ARG CADDY_VERSION=latest

RUN xcaddy build ${CADDY_VERSION} \
    --with github.com/caddy-dns/cloudflare \
    --with github.com/caddy-dns/desec \
    --with github.com/ss098/certmagic-s3

FROM caddy:2-alpine

COPY --from=builder /usr/bin/caddy /usr/bin/caddy

VOLUME [ "/out" ]
ENTRYPOINT [ "/bin/cp" ]
CMD [ "/usr/bin/caddy", "/out/caddy" ]