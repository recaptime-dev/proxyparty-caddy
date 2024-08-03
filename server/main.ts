import { Hono } from 'hono'
import { poweredBy } from './lib/utils.ts'
import redirectsData from "./redirect-data.json" with { type: "json" }
import { landingPageDisabledRedirect, landingPageNoTargetUrl, landingPageText404  } from "./lib/constants.ts"
import { parseDomain, fromUrl } from "parse-domain";
import { redirectData } from "./lib/types.ts";

const app = new Hono()
const deployDomain = Deno.env.get("PROXYPARTY_BASE_URL") || "proxyparty-hono.recaptime.dev"
const denoDeploySubdomain = Deno.env.get("PROXYPARTY_DENO_DEPLOY_PROJECT") || "rtdev-proxyparty"

app.use(poweredBy())

app.on("GET", "/*", async (c, next) => {
  if (c.req.path == "/" || c.req.path == "/ping") {
    return await next()
  }
  const { subDomains, domain, topLevelDomains } = parseDomain(fromUrl(c.req.url))
  let subdomain = ``
  let domainName = ``
  if (subDomains) {
    subdomain = subDomains.join(".")
  }
  domainName = `${domain}.${topLevelDomains.join(".")}`
  console.log(`[debug] subdomain from parse-domain: ${JSON.stringify(subDomains)}, result: ${subdomain}`)
  console.log(`[debug] base domain from parse-domain: ${JSON.stringify([...domain, ...topLevelDomains])}, result: ${domainName}`)
  const {hostname} = new URL(c.req.url);
  const data: redirectData = redirectsData[domainName]
  const subData = data?.subdomains?.[subdomain] || {}
  console.log(`[debug] subdomain data: ${JSON.stringify(subData)}`)

  if (typeof subData.target === "string" && subData.target.length > 0) {
    if (subData.disabled == true) {
      return c.newResponse(landingPageDisabledRedirect(subData.disablement_reason))
    }
    return c.redirect(subData.target)
  } else {
    if (hostname == domainName) {
      if (data.isBaseUrl == true) {
        return c.redirect(`${data.target}${c.req.path}`)
      }
      if (data.disabled == true) {
        return c.newResponse(landingPageDisabledRedirect(subData.disablement_reason))
      }
      return c.redirect(data.target)
    } else {
      return c.newResponse(landingPageText404())
    }
  }
})

app.get('/', (c) => {
  const urlParser = new URL(c.req.url);
  const { hostname } = urlParser
  const data: redirectData = redirectsData[hostname]

  console.log(`[debug] host: ${hostname}`)
  console.log(`[debug] redirect data: ${JSON.stringify(data)}`)

  if (hostname == "localhost" || hostname == deployDomain || hostname == `${denoDeploySubdomain}.deno.dev`) {
    return c.redirect("https://github.com/recaptime-dev/proxyparty-caddy")
  }

  if (data.disabled == true) {
    return c.newResponse(landingPageDisabledRedirect(data.target, data.disablement_reason), 400)
  }

  if (data.target == "" || data.target == null || data.target == undefined) {
    return c.newResponse(landingPageNoTargetUrl(hostname), 400)
  }

  if (data) {
    return c.redirect(data.target)
  }
  return c.newResponse(landingPageText404(c.req.url), 404)
})
app.get("/ping", (c) => {
  return c.json({ok: true, result: "Pong"})
})

Deno.serve(app.fetch)
