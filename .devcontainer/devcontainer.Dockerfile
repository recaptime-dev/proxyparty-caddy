FROM golang:bookworm as xcaddy-buildkit

RUN go install github.com/caddyserver/xcaddy/cmd/xcaddy@latest \
    && /go/bin/xcaddy build \
      --with github.com/caddy-dns/cloudflare \
      --with github.com/caddy-dns/vercel \
      --with github.com/caddy-dns/netlify \
      --with github.com/ss098/certmagic-s3 \
      --output /go/bin/caddy

FROM mcr.microsoft.com/devcontainers/base:bookworm as base

COPY --from=xcaddy-buildkit /go/bin/caddy /usr/local/bin/caddy
