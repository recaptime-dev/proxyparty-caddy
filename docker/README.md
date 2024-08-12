# Docker-based deployments

## Using our instance

### The Railway way

If you don't want to send a patch on our config, you can file a new issue
stating your request to proxy or redirect something to somewhere else on the
internet.

Once we added your domain for redirection and its redirect or proxy options,
we configure custom domain setup in the Railway dashboard. If you do use wildcard domains,
make sure to disable Cloudflare Universal SSL (and subscribe to Advanced SSL or disable
Cloudflare proxy for orange-proxied sites to avoid TLS errors)
before overriding `_acme-challenge.<your-domain.tld>` with a CNAME pointing to a
`challenge.railwaydns.net` subdomain. Also, you may need to either duplicate the service or
upgrade to Pro to use more than two domains per service[^1] if you self-host your
configuration instead.

[^1]: See <https://docs.railway.app/reference/public-networking#custom-domain-count-limits> for context.
By default, you can add up to 10 domains per service but contact Railway team if you need more.

### Via GCP Compute Engine

```

```

## Self-host

You can self-host this via the Railway template using the link below and add
your API keys as needed (mainly for data storage via Cloudflare R2 over S3 API
and API calls for TXT DNS challenges during certificate issuances).

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/PqHfEF?referralCode=ajhalili2006)

**Sponsorship notice**: By using the button below and paying for your first
bill or buying compute credits, Andrei Jiroh will receive 5 USD in compute
credits on Railway. [Learn more about how referrals work](https://docs.railway.app/reference/accounts#referrals).

Alternatively you can build your own image using the following command:

```bash
docker build -f docker/Dockerfile -t ghcr.io/recaptime-dev/proxyparty-caddy:localdev .
```

Run it on your server (adjust ports as needed):

```bash
docker run --rm -p 80:8000 -p 443:8080 \
--cap-add CAP_NET_BIND_SERVICE \
  -v ./config/caddy/meta.Caddyfile:/etc/caddy/Caddyfile \
  -v caddy_data:/data \
  ghcr.io/recaptime-dev/proxyparty-caddy:localdev
```

To reload the server as you update configs:

```bash
# from its Docker Hub container image README: https://hub.docker.com/_/caddy
caddy_container_id=$(docker ps | grep caddy | awk '{print $1;}')
docker exec -w /etc/caddy $caddy_container_id caddy reload
```
