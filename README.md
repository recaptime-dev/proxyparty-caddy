# `proxyparty.recaptime.dev` = Docker + Caddy redirects and proxies

It's like [`proxyparty.hackclub.com`](https://github.com/hackclub/proxyparty) but using Caddy as our implementation backend, alongside a Hono server in Deno Deploy in cases where we cannot
add your domain into the Railway service backing this server.

Currently this service is provided on limited support basis and things may
break. [Consider sponsoring Andrei Jiroh](https://github.com/sponsors/ajhalili2006) or share your spare compute credits (or donate directly) on
[his Railway profile](https://railway.app/u/ajhalili2006) if you like to
keep this maintained and support his open-source work.

## Setup


## Self-hosting

You can self-host this via the Railway template using the link below and add
your API keys as needed (mainly for data storage via Cloudflare R2 over S3 API
and API calls for TXT DNS challenges during certificate issuances).

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/PqHfEF?referralCode=ajhalili2006)

**Sponsorship notice**: By using the button below and paying for your first
bill or buying compute credits, Andrei Jiroh will receive 5 USD in compute
credits on Railway. [Learn more about how referrals work](https://docs.railway.app/reference/accounts#referrals).
