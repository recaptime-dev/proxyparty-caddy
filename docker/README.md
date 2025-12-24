# Docker-based builds + deployments

## Usage

You can use our built Docker images from either [GitHub Container Registry](https://github.com/orgs/recaptime-dev/packages/container/package/proxyparty-caddy)
or [GitLab Container Registry](https://gitlab.com/recaptime-dev/infra/proxyparty-caddy) at GitLab SaaS.

```bash
docker run -d --name proxyparty-caddy \
  -v ./config/caddy:/etc/caddy \
  -p 80:80 \
  -p 443:443 \
  -p 4208:4208 \
  registry.gitlab.com/recaptime-dev/infra/proxyparty-caddy/caddy-builds:latest
```

Alternatively, you can also extract our custom Caddy binary from the Docker image
instead of running `pnpm run build` (which will build using [`localdev.Dockerfile`](localdev.Dockerfile)
and simply copying it to `bin` directory mounted at `/out` inside the container).

```bash
docker run -it --rm \
  -v $(pwd)/bin:/out \
  --entrypoint /bin/cp \
  registry.gitlab.com/recaptime-dev/infra/proxyparty-caddy/caddy-builds:latest \
  /usr/bin/caddy /out/caddy
```

## Plugins used in the setup

Here are the following Caddy plugins that we use for running our proxyparty instance.

* `github.com/caddy-dns/cloudflare` - Cloudflare DNS provider for DNS TXT record challenges
* `github.com/caddy-dns/desec` - deSEC DNS provider for DNS TXT record challenges
* `github.com/ss098/certmagic-s3` - S3 storage backend for [Certmagic](github.com/caddyserver/certmagic)

If you want to add a new plugin, just send us a merge request (or file a issue first if you prefer)
and we'll look onto it. Unmaintained plugins over 2+ years may be removed unless otherwise specified.

## Local development

> [!NOTE]
> Requires Docker Engine (or Docker Desktop) installed for local builds. If you do
> remote builds via `docker context`/`DOCKER_CONTEXT` or `DOCKER_HOST`, the usual
> Docker CLI should be enough.
>
> If you prefer not to use Docker, make sure to install Go 1.23+ and
> [`xcaddy`](https://github.com/caddyserver/xcaddy) installed on your machine.

We included a convenience script at our [`package.json`](../package.json) through
`pnpm run build` so you can use our Caddy setup for linting and formatting configs here.

```bash
# Build the image with BuildKit (cue DOCKER_BUILDKIT variable there)
DOCKER_BUILDKIT=1 docker build -f docker/localdev.Dockerfile -t ghcr.io/proxyparty-caddy/localdev .

# then export the built binary in one go
docker run --rm -it -v $PWD/scripts:/out ghcr.io/proxyparty-caddy/localdev
```

For the curious why we mount the `scripts` directory to the `/out` in-container directory,
look no further at the `CMD` section of the local development Dockerfile.

```Dockerfile
# This is where the magic goes
ENTRYPOINT [ "/bin/cp" ]
CMD [ "/usr/bin/caddy", "/out/caddy" ]
```

### Dockerless builds

Assuming you have `xcaddy` and Go installed, run the following:

```bash
# Note to reader: To build against a specific commit or version
# set CADDY_VERSION into that commit hash/version you need
# instead of `latest`.
xcaddy build ${CADDY_VERSION:-"latest"} \
    --with github.com/caddy-dns/cloudflare \
    --with github.com/caddy-dns/desec \
    --with github.com/ss098/certmagic-s3
```
