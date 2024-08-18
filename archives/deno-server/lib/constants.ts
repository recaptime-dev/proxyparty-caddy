export const landingPageText404 = (url: string) => `\
proxyparty-hono is running, but there's no redirect available for the \
following URL/route: ${url}

Please contact @ajhalili2006 on hackclub.slack.com / recaptime-dev.zulipchat.com \
OR file a new issue at https://github.com/recaptime-dev/proxyparty-caddy/issues/new/choose \
if you have questions about this service from Recap Time Squad.
`

export const landingPageDisabledRedirect = (reason?: string | null | undefined) => `\
proxyparty-hono's configuration disabled redirects for this (sub)domain \
it for the following reason: ${reason !== null ? reason : "No reason provided"}

Please contact @ajhalili2006 on hackclub.slack.com / recaptime-dev.zulipchat.com \
OR file a new issue at https://github.com/recaptime-dev/proxyparty-caddy/issues/new/choose \
if you have questions about this service from Recap Time Squad.
`;

export const landingPageNoTargetUrl = (base: string) => `\
proxyparty-hono tried to handle redirects for ${base}, but its target URL is left blank \
or undefined in the configuration.

Please contact @ajhalili2006 on hackclub.slack.com / recaptime-dev.zulipchat.com \
OR file a new issue at https://github.com/recaptime-dev/proxyparty-caddy/issues/new/choose \
if you have questions about this service from Recap Time Squad.
`;

export const repo =
  Deno.env.get("REPO_URL") ||
  "https://github.com/recaptime-dev/proxyparty-caddy";