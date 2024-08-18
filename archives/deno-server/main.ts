import { Hono } from 'hono'
import { poweredBy } from './lib/utils.ts'
import redirectsData from "./redirect-data.json" with { type: "json" }
import { landingPageDisabledRedirect, landingPageNoTargetUrl, landingPageText404, repo  } from "./lib/constants.ts"
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

  console.log(`[debug] url: ${c.req.url}`)
  const parseDomainData = parseDomain(fromUrl(c.req.url))
  console.log(`[debug] parse-domain data: ${JSON.stringify(parseDomainData)}`)
  
  let subdomain = ``
  let domainName = ``
  
  if (parseDomainData.subDomains) {
    subdomain = parseDomainData.subDomains.join(".")
  }
  
  if (parseDomainData.domain && parseDomainData.topLevelDomains) {
    domainName = `${parseDomainData.domain}.${parseDomainData.topLevelDomains?.join(".")}`
  }
  
  const {hostname} = new URL(c.req.url);
  const data: redirectData = redirectsData?.[domainName] || {}
  console.log(`[debug] base domain config: ${JSON.stringify(data)}`)
  const subData = data?.subdomains?.[subdomain] || {}
  console.log(`[debug] subdomain data: ${JSON.stringify(subData)}`)

  if (typeof subData.target === "string" && subData.target.length > 0) {
    if (subData.disabled == true) {
      return c.newResponse(landingPageDisabledRedirect(subData.disablement_reason))
    }
    return c.redirect(subData.target)
  } else {
    if (hostname == domainName) {
      if (typeof data.target === "string" && data.target.length > 0) {
        if (data.isBaseUrl == true) {
          return c.redirect(`${data.target}${c.req.path}`)
        }
        return c.redirect(data.target)
      }
      if (data.disabled == true) {
        return c.newResponse(landingPageDisabledRedirect(subData.disablement_reason))
      }
      return c.newResponse(landingPageText404(c.req.url), 404)
    } else {
      return c.redirect(repo)
    }
  }
})

app.get('/', (c) => {
  console.log(`[debug] url: ${c.req.url}`)
  const parseDomainData = parseDomain(fromUrl(c.req.url))
  console.log(`[debug] parse-domain data: ${JSON.stringify(parseDomainData)}`)
  
  let subdomain = ``
  let domainName = ``
  
  if (parseDomainData.subDomains) {
    subdomain = subDomains.join(".")
  }
  
  if (parseDomainData.domain && parseDomainData.topLevelDomains) {
    domainName = `${domain}.${topLevelDomains?.join(".")}`
  }
  const {hostname} = new URL(c.req.url);
  const data: redirectData = redirectsData?.[domainName] || {}
  console.log(`[debug] base domain config: ${JSON.stringify(data)}`)
  const subData = data?.subdomains?.[subdomain] || {}
  console.log(`[debug] subdomain data: ${JSON.stringify(subData)}`)

  if (hostname == "localhost" || hostname == deployDomain || hostname == `${denoDeploySubdomain}.deno.dev`) {
    return c.redirect(repo)
  }

  if (data.disabled == true) {
    return c.newResponse(landingPageDisabledRedirect(data.disablement_reason), 400)
  }

  if (typeof data.target == "string" && data.target.length > 0) {
    return c.redirect(data.target)
  }
  return c.newResponse(landingPageText404(c.req.url), 404)
})
app.get("/ping", (c) => {
  return c.json({ok: true, result: "Pong"})
})

Deno.serve(app.fetch)
