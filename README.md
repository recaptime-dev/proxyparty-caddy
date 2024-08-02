# `proxyparty.recaptime.dev` = Docker + Caddy redirects and proxies

It's like [`proxyparty.hackclub.com`](https://github.com/hackclub/proxyparty) but using Caddy as our implementation backend, alongside a Hono server in Deno Deploy in cases where we cannot
add your domain into the Railway service backing this server.

Currently this service is provided on limited support basis and things may
break. [Consider sponsoring Andrei Jiroh](https://github.com/sponsors/ajhalili2006) or share your spare compute credits (or donate directly) on
[his Railway profile](https://railway.app/u/ajhalili2006) if you like to
keep this maintained and support his open-source work.

## Setup

Currently we use Railway for our Caddy-based setup, although we can hook up
Deno Deploy for your (sub)domain in situtations where you cannot do `ALIAS`
records but we only support redirects in that alternative route.

Note that since Railway handles the TLS termination part, we do not need
to configure TLS ourselves, but we set up DNS integrations for Cloudflare,
Vercel and Netlify if needed in the future.

### Adding your domain

If you don't want to send a patch on our config, you can file a new issue
stating your request to proxy or redirect something to somewhere else on the
internet.

Once we added your domain for redirection and its redirect or proxy options,
we configure custom domain setup in the Railway dashboard.

## Self-hosting

You can self-host this via the Railway template using the link below and add
your API keys as needed (mainly for data storage via Cloudflare R2 over S3 API
and API calls for TXT DNS challenges during certificate issuances).

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/PqHfEF?referralCode=ajhalili2006)

**Sponsorship notice**: By using the button below and paying for your first
bill or buying compute credits, Andrei Jiroh will receive 5 USD in compute
credits on Railway. [Learn more about how referrals work](https://docs.railway.app/reference/accounts#referrals).

### Running in Docker

Alternatively you can build your own image using the following command:

```bash
docker build -f docker/Dockerfile -t recaptime-dev/proxyparty-caddy .
```

Run it on your server (adjust ports as needed):

```bash
docker run --rm -p 80:8000 -p 443:8080 \
  -v ./docker/Caddyfile:/etc/caddy/Caddyfile \
  -v caddy_data: /data \
  recaptime-dev/proxyparty-caddy
```

To reload the server as you update configs:

```bash
# from its Docker Hub container image README: https://hub.docker.com/_/caddy
caddy_container_id=$(docker ps | grep caddy | awk '{print $1;}')
docker exec -w /etc/caddy $caddy_container_id caddy reload
```
