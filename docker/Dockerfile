# syntax=docker/dockerfile:1
FROM caddy:2.8.4-builder-alpine as builder

RUN xcaddy build \
    --with github.com/caddy-dns/cloudflare \
    --with github.com/caddy-dns/vercel \
    --with github.com/caddy-dns/netlify \
    --with github.com/ss098/certmagic-s3

FROM caddy:2.8.4-alpine

COPY --from=builder /usr/bin/caddy /usr/bin/caddy
COPY config/caddy/railway.Caddyfile /etc/caddy/Caddyfile