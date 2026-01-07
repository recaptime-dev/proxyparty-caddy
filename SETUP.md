# Infra Setup

This page documents our setup for the `proxypartylab` service of Recap Time Squad,
similarly to <https://proxyparty.hackclub.com>. You can use this document to
run your own instance of `proxypartylab` with your own configuration and secrets.

## Where it's running currently?

As mentioned earlier in the README, it is currently running on an Standard B2ats v2 (2 vcpus, 1 GiB memory)
Ubuntu LTS 24.04 VM on Microsoft Azure's Central India region under Azure for Students perk on
GitHub Education's Student Dev Pack with 64 GiB of Premium SSD LRS for the root partition, mainly to run
the [Tangled Knot server](https://tangled.org/recaptime.dev/knot-docker-nest) and proxy incoming traffic
to Andrei Jiroh's homelab server.

The Azure for Students credits in question are held and managed at Andrei Jiroh's personal Azure/Entra ID
tenant linked to his personal Microsoft account. It will be planned to be transferred into Recap Time Squad's
Azure tenant in the future with enough funding.

## Caddy config and custom binary builds

We use `xcaddy` via Docker image builds to easily load up DNS plugins for Cloudflare and friends,
as well as using R2 as storage backend for TLS certificate storage. To reproduce our plugin setup locally,
run the following build command:

```bash
CADDY_VERSION=latest
xcaddy build ${CADDY_VERSION} \
    --with github.com/caddy-dns/cloudflare \
    --with github.com/caddy-dns/desec \
    --with github.com/ss098/certmagic-s3
```

For the configuration, we store them in version control at the [`config/caddy`](./config/caddy) directory, while the
static site content for parking pages and others are at [`pages`](./pages) directory.

## Tailscale SSH ACLs

* @ajhalili2006 has admin access to both `root` and `caddy` users with 30m reauth
(while its own account on no-reauth setup), alongside Caddy's Admin API access.

If you need access, please contact @ajhalili2006 via #access-requests in Recap Time Squad Zulip Cloud organization.

## Caddy user setup

Feel free to adjust these commands as needed in your machine/container:

```bash
# Interactively via adduser
# /bin/bash as shell for CI deployments, since you probably don't want to SSh as root
# if you use /sbin/nologin instead.
sudo adduser --system -G docker --home /var/lib/caddy --shell /bin/bash --comment "caddy user" caddy

# On scripts via useradd
sudo useradd --system --create-home --home-dir /var/lib/caddy --groups docker --shell /bin/bash --comment "caddy user" caddy
```

This Git repository is cloned at the dedicates user account for Caddy under the `src` subdirectory on
its home directory.

## systemd service unit files

We have [a service unit file][service] based off [the upstream] for our setup,
alongside a [Docker Compose file][composefile] for using our container image. They are
managed at system-wide level to take advantage of granting capabilities for using
prvilleged ports.

[service]: ./config/systemd/caddy.service
[composefile]: ./compose.yml
[the upstream]: https://github.com/caddyserver/dist/blob/master/init%2Fcaddy-api.service

## Secrets management

We use `dotenvx` to manage secrets fully encrypted in [`.env.production`](./.env.production). Simply ping @ajhalii2006 on
either [`#recaptime-dev:hackclub.slack.com`] or [access requests issue tracker] in GitLab
for the private keys to decrypt secrets.

[`#recaptime-dev:hackclub.slack.com`]: https://hackclub.slack.com/archives/C07H1R2PW9W
[access requests issue tracker]: https://go.recaptime.dev/new-issue/access-requests

## From the Archives

### Railway

Although this setup is a bit unused, it uses a [custom Dockerfile](./docker/Dockerfile)
as [configured in `railway.toml`](./railway.toml) alongside enabling app sleep on
inactivity and other things.

### GCP Compute Engine VM

We use a `e2-micro` instance with with 25 GB of storage for the boot disk. 
elect team members can SSH into it over Tailscale on `proxypartylab-prod-gcp.tuna-skate.ts.net`
and even remotely reload Caddy configuration over port `20241`.

For the OS image itself, we simply use Debian 12 without Nix.
