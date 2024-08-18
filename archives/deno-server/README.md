# `proxyparty-hono` - A reimplementation of `proxyparty.hackclub.com` in Hono + Deno

This version is hosted on Deno Deploy as an alternative to the Railway service for our own proxyparty in cases where only redirects are needed.

Unlike our Caddy reimplementation of it, we do not implement the proxying parts
due to performance reasons when using the Fetch JavaScript API.

Note that you need to upgrade to Deno Deploy Pro to setup wildcard domains if you self-host.

## Setup

TBD

## Development

Get [Deno](https://docs.deno.com/runtime/manual/#install-deno) installed on your
local development environment or open the repository in Codespaces or Gitpod
and run the following for dev server.

```bash
deno task start
```