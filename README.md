# `proxyparty.recaptime.dev` = Caddy in Docker for redirects and stuff

It's like [`proxyparty.hackclub.com`](https://github.com/hackclub/proxyparty)
but using Caddy as our implementation backend, hosted on a relatively small
Azure VM in Central India (previously on GCP and AWS).

Currently this service is provided on limited support basis and things may
break. Consider funding our open-source work to keep this running at
<https://recaptime.dev/donate>.

## Using the service

### Parking pages and redirects

If you want to show a parking page for your site while working onto it or redirect to something else:

* [File a GitHub issue][new-issue] with the the destination URL field either:
  * being `Not Applicable` and ticking **Show a parking page instead of redirecting**
  * or for redirects, fill that in
* Add additional details throughout the form and submit (e.g. additional redirects, etc.)
* Once fully onboarded on our system (through the [Proxyparty Internals API](https://api.proxyparty.recaptime.dev/docs) for Caddy's On-demand TLS feature), add a CNAME record pointing to `proxyparty.recaptime.dev` on your side.
* You're good to go! Caddy will handle the the TLS renewal for you behind the scenes while we manage the infrastructure for you.

[new-issue]: https://github.com/recaptime-dev/proxyparty-caddy/issues/new?template=add-domain.yml

## Self-hosting

See `SETUP.md` for a more detailed document about our setup and to help you
self-host them for your own configuration.

## License

MPL-2.0
