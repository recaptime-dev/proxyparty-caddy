/**
 * This is the entrypoint code for the API service used for On-Demand TLS domain checks on Caddy,
 * implemented using the Hono framework for Deno.
 */

import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { bearerAuth } from "hono/bearer-auth";
import { logger } from "hono/logger";
import type { RequestIdVariables } from "hono/request-id";
import { formatLogger } from "./utils.ts";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { registerRoutes } from "./routes/index.ts";

export type ApiContext = OpenAPIHono<{
  Variables: RequestIdVariables;
}>;

const app = new OpenAPIHono<{
  Variables: RequestIdVariables;
}>();

app.use("*", requestId());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  headers: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(logger(formatLogger));
app.use("*", async (c, next) => {
  formatLogger(`Handling request at ${c.req.url}`, c.get("requestId"));
  await next();
});
app.use(
  "/admin/*",
  bearerAuth({
    verifyToken: async (token, c) => {
      const adminToken = Deno.env.get("PROXYPARTY_ADMIN_TOKEN");

      if (token === adminToken) {
        formatLogger(
          `Admin auth token verification succeeded for request at ${c.req.url}`,
          c.get("requestId"),
        );
        return true;
      }
      formatLogger(
        `Admin auth token verification failed for request at ${c.req.url} (was ${token})`,
        c.get("requestId"),
      );
      return false;
    },
  }),
);

app.get("/", (c) => {
  return c.text("Proxyparty Internals API is up and running.");
});

registerRoutes(app);

app.openAPIRegistry.registerComponent("securitySchemes", "AdminApiToken", {
  type: "http",
  scheme: "bearer",
  description:
    "Admin API token for admin endpoints. Managed via `PROXYPARTY_ADMIN_TOKEN` variable on the backend.",
});

app.doc31("/openapi.json", (c) => ({
  openapi: "3.1.0",
  info: {
    title: "Proxyparty Internals API",
    version: "0.1.0",
    description:
      "API service for Proxyparty internals, including On-Demand TLS domain checks as used by Caddy.",
    contact: {
      name: "Recap Time Squad",
      url: "https://gitlab.com/recaptime-dev/infra/proxyparty-caddy/-/issues",
      email: "proxyparty-support@lorebooks.wiki",
    },
    license: {
      name: "MPL-2.0",
      url: "https://www.mozilla.org/en-US/MPL/2.0/",
    },
  },
  servers: [
    {
      url: new URL(c.req.url).origin,
      description: "Current environment",
    },
    {
      url: "https://api.proxyparty.recaptime.dev",
      description: "Production - recaptime.dev",
    },
    {
      url: "https://api.proxyparty.lorebooks.wiki",
      description: "Production - lorebooks.wiki",
    },
  ],
  tags: [
    {
      name: "Admin",
      description: "Admin endpoints for managing the API.",
    },
    {
      name: "Caddy / Public Endpoints",
      description:
        "API endpoints used by Caddy that are also available to use publicly.",
    },
  ],
}));
app.use(
  "/docs",
  swaggerUI({
    title: "Proxyparty Internals API Docs",
    url: "/openapi.json",
  }),
);

Deno.serve({
  port: Number(Deno.env.get("PORT") || 8080),
  handler: app.fetch,
});
