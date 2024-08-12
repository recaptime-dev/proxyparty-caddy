FROM mcr.microsoft.com/devcontainers/base:bookworm

USER root

RUN wget https://github.com/caddyserver/xcaddy/releases/download/v0.4.2/xcaddy_0.4.2_linux_amd64.deb \
    -O /tmp/xcaddy.deb && apt install xcaddy --yes