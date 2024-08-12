# Setup

This page documents our setup for the `proxypartylab` service of Recap Time Squad,
similarly to <https://proxyparty.hackclub.com>.

## Caddy config and custom binary builds

We use `xcaddy` to easily load up DNS plugins for Cloudflare and friends, as well
as using R2 as storage backend.

For the configuration, we store them in version control at the [`config/caddy`](./config/caddy) directory.

## Railway

Although this setup is a bit unused, it uses a [custom Dockerfile](./docker/Dockerfile)

## GCP Compute Engine VM

We use a `e2-micro` instance with with 25 GB of storage for
the boot disk. Select team members can SSH into it over Tailscale
on `proxypartylab-prod-gcp.tuna-skate.ts.net` (if you are at Hack Club, ask @ajhalili2006 to share the machine instead)

### Tailscale SSH ACLs

* @ajhalili2006: can SSH into `ajhalili2006` via GCP dashboard and into both `ajhalili2006` and `caddy` on Tailscale with reauth check every 30m

If you need access, please contact @ajhalili2006 via #recaptime-dev on Hack Club Slack
or #access-requests in Recap Time Squad Zulip Cloud organization.

### Caddy user setup

Feel free to adjust

```bash
sudo addgroup --system --gid 2500 caddy-admin
sudo adduser --system --uid 2500 --ingroup caddy-admin --home /var/caddy --shell /bin/bash --comment caddy user caddy
```

### systemd service unit files

We have [a service unit file][service] based off [the upstream]
for our setup, alongside a [Docker-based setup][docker-service]
for using our container image. They are managed at system-wide
level to take advantage of granting capabilities for using
prvilleged ports.

[service]: ./config/systemd/caddy.service
[docker-service]: ./config/systemd/caddy-docker.service
[the upstream]: https://github.com/caddyserver/dist/blob/master/init%2Fcaddy.service
