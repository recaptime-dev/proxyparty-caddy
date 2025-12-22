# On-demand TLS auth service

A mini API server that we use to minimize abuse by enabling allowlisting + blocklisting
domains for On-demand TLS on proxyparty.

## Local development

Run `deno run dev` to run the server locally with hot reloading while you do development.
The Swagger UI can be accessed at `/docs` endpoint with the matching OpenAPI spec at the
`/openapi.json` endpoint.

If you have access to [Recap Time Squad's Deno Deploy organization](https://console.deno.com/recaptime-dev)
(or have an organization-level access token handy), you can run a tunneled local server
with `deno run devtunnel` command (don't forget to set `DENO_DEPLOY_TOKEN` environment
variable to skip the interactive login prompt).

### Testing API endpoints

To test the API endpoints locally, set `PROXYPARTY_ADMIN_TOKEN` to something like
`prxypty_dev.test123` so that you can authenicate against the admin endpoints.
