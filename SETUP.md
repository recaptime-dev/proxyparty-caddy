# Setup

This page documents our setup for the `proxypartylab` service of Recap Time Squad,
similarly to <https://proxyparty.hackclub.com>. You can use this document to
run your own instance of `proxypartylab` with your own configuration and secrets.

## Caddy config and custom binary builds

We use `xcaddy` to easily load up DNS plugins for Cloudflare and friends, as well
as using R2 as storage backend. To reproduce our plugin setup locally, run:

```bash
xcaddy build \
    --with github.com/caddy-dns/cloudflare \
    --with github.com/caddy-dns/vercel \
    --with github.com/caddy-dns/netlify \
    --with github.com/ss098/certmagic-s3
```

For the configuration, we store them in version control at the [`config/caddy`](./config/caddy) directory, specifically:

* Our GCP setup is hosted under `gcp` subdirectory and we chop our configs into its
own directories (`gcp/projects` for our main domain and related projects, as well as
our )

## Railway

Although this setup is a bit unused, it uses a [custom Dockerfile](./docker/Dockerfile)
as [configured in `railway.toml`](./railway.toml) alongside enabling app sleep on
inactivity and other things.

## GCP Compute Engine VM

> [!note]
> **Hack Clubber? (including those on HCB ops)** Ping @ajhalili2006 in `#recaptime-dev` on Hack Club Slack for a
> machine share link. Make sure to install Tailscale client on your device before
> proceeding.

We use a `e2-micro` instance with with 25 GB of storage for the boot disk. 
elect team members can SSH into it over Tailscale on `proxypartylab-prod-gcp.tuna-skate.ts.net`
and even remotely reload Caddy configuration over port `20241`.

For the OS image itself, we simply use Debian 12 without Nix.

## Tailscale SSH ACLs

* @ajhalili2006 has admin access to both `root` and `caddy` users with 30m reauth (while its own account on no-reauth setup), alongside Admin API access.

If you need access, please contact @ajhalili2006 via #recaptime-dev on Hack Club Slack
or #access-requests in Recap Time Squad Zulip Cloud organization.

## Caddy user setup

Feel free to adjust these commands as needed in your machine/container:

```bash
sudo addgroup --system --gid 2500 caddy-admin
sudo adduser --system --uid 2500 --ingroup caddy-admin --home /var/caddy --shell /bin/bash --comment caddy user caddy
```

## systemd service unit files

We have [a service unit file][service] based off [the upstream]
for our setup, alongside a [Docker-based setup][docker-service]
for using our container image. They are managed at system-wide
level to take advantage of granting capabilities for using
prvilleged ports.

[service]: ./config/systemd/caddy.service
[docker-service]: ./config/systemd/caddy-docker.service
[the upstream]: https://github.com/caddyserver/dist/blob/master/init%2Fcaddy-api.service

## Secrets management

We use `dotenvx` to manage secrets fully encrypted in [`.env.production`](./.env.production). Simply ping @ajhalii2006 on
either [`#recaptime-dev:hackclub.slack.com`] or [access requests issue tracker] in GitLab
for the private keys to decrypt secrets.

[`#recaptime-dev:hackclub.slack.com`]: https://hackclub.slack.com/archives/C07H1R2PW9W
[access requests issue tracker]: https://go.recaptime.dev/new-issue/access-requests

