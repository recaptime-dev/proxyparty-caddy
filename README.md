# `proxyparty.recaptime.dev` = Docker + Caddy redirects and proxies

It's like `proxyparty.hackclub.com` but using Caddy as our implementation backend, alongside a Hono server in Deno Deploy in cases where we cannot
add your domain into the Railway service.

Currently this service is provided on limited support basis and things may
break. [Consider sponsoring Andrei Jiroh](https://github.com/sponsors/ajhalili2006) if you like to keep this maintained.

## Setup

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/PqHfEF?referralCode=ajhalili2006)

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
