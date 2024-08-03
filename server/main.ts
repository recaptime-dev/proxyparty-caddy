import { Hono } from 'hono'
import { poweredBy } from './lib/utils.ts'
import redirectsData from "./redirect-data.json" with { type: "json" }
import { landingPageDisabledRedirect, landingPageNoTargetUrl, landingPageText404  } from "./lib/constants.ts"

type routes = {
  path: string,
  target?: string
}

type redirectData = {
  target: string
  isBaseUrl: boolean
  disabled?: boolean
  disablement_reason?: string | null
  routes: routes[]
}

const app = new Hono()
const deployDomain = Deno.env.get("PROXYPARTY_BASE_URL") || "proxyparty-hono.recaptime.dev"
const denoDeploySubdomain = Deno.env.get("PROXYPARTY_DENO_DEPLOY_PROJECT") || "rtdev-proxyparty"

app.use(poweredBy())

app.on("GET", "/*", async (c, next) => {
  if (c.req.path == "/" || c.req.path == "/ping") {
    return await next()
  }
  const urlParser = new URL(c.req.url);
  const { hostname } = urlParser
  const data: redirectData = redirectsData[hostname]

  console.log(`[debug] host: ${hostname}, path: ${c.req.path}`)
  console.log(`[debug] redirect data: ${JSON.stringify(data)}`)

  if (!data) {
    return c.newResponse(landingPageText404(c.req.url), 404)
  }

  if (data.disabled == true) {
    return c.newResponse(landingPageDisabledRedirect(data.target, data.disablement_reason))
  }

  if (data.isBaseUrl == true) {
    return c.redirect(`${data.target}${c.req.path}`)
  }

  if (data.target == "" || data.target == null || data.target == undefined) {
    return c.newResponse(landingPageNoTargetUrl(hostname))
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

  if (data.target == "" || data.target == null || data.target == undefined) {
    return c.newResponse(landingPageNoTargetUrl(hostname))
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
