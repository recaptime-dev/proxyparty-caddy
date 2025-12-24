import { createRoute, z } from "@hono/zod-openapi";
import {
  banDomain,
  DomainInfo,
  getDomainStatus,
  kvApi,
  removeDomain,
  SubdomainInfo,
  unbanDomain,
} from "../kv.ts";
import { formatLogger, getDomainData } from "../utils.ts";
import { ApiContext } from "../main.ts";

const admin_domainInfoSchema = z.object({
  status: z.enum(["allowed", "blocked"]),
  block_reason: z.string().optional(),
  blocked_at: z.number().optional(),
  last_updated: z.number(),
  created_at: z.number(),
  include_subdomains: z.boolean().optional().default(false),
});

const admin_banDomainSchema = z.object({
  reason: z.string().min(1).max(255).optional(),
  include_subdomains: z.boolean().optional().default(false),
});

const admin_domainInfoResult = z.object({
  ok: z.boolean().default(true),
  result: admin_domainInfoSchema,
});

const admin_errorSchema = z.object({
  ok: z.boolean().default(false),
  error: z.string().min(1).max(255),
});

const admin_removeDomainSchema = z.object({
  ok: z.boolean().default(true),
});

export const domain_paramSchema = z.object({
  domain: z.string().min(1).max(255).regex(/^[a-zA-Z0-9.-]+$/).default(
    "example.com",
  ),
});

export const adminApi_banDomain = createRoute({
  method: "post",
  path: "/admin/{domain}/ban",
  summary:
    "Ban a domain (or subdomain) from the on-demand TLS certificate issuance flow.",
  request: {
    params: domain_paramSchema,
    body: {
      content: {
        "application/json": {
          schema: admin_banDomainSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: admin_domainInfoResult,
        },
      },
      description: "Domain information",
    },
  },
  security: [
    {
      AdminApiToken: [],
    },
  ],
  tags: ["Admin"],
});

export async function adminApiHandler_banDomain(ctx) {
  const { domain } = ctx.req.valid("param");
  const { reason, include_subdomains } = ctx.req.valid("json");

  const domainStatus = await getDomainData(domain);

  if (domainStatus.is_valid == false) {
    return ctx.json({ ok: false, error: "Invalid domain" }, 400);
  }

  const result = await banDomain(domain, reason, include_subdomains);
  return ctx.json(result);
}

export const adminApi_removeDomain = createRoute({
  method: "delete",
  path: "/admin/{domain}",
  summary:
    "Remove a domain (or subdomain) from known domains without banning it.",
  request: {
    params: domain_paramSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: admin_removeDomainSchema,
        },
      },
      description: "Domain removed",
    },
    404: {
      content: {
        "application/json": {
          schema: admin_errorSchema,
        },
      },
      description: "Domain not found",
    },
  },
});

export async function adminApiHandler_removeDomain(ctx) {
  const { domain } = ctx.req.valid("param");

  try {
    const result = await removeDomain(domain);
    return ctx.json({ ok: true });
  } catch (error) {
    return ctx.json({ ok: false, error: error.message }, 500);
  }
}

export const adminApi_unbanDomain = createRoute({
  method: "post",
  path: "/admin/{domain}/unban",
  summary:
    "Unban a domain (or subdomain) from the on-demand TLS certificate issuance flow.",
  request: {
    params: domain_paramSchema,
  },
  security: [
    {
      AdminApiToken: [],
    },
  ],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: admin_domainInfoSchema,
        },
      },
      description: "Domain information",
    },
  },
  tags: ["Admin"],
});

export async function adminApiHandler_unbanDomain(ctx) {
  const { domain } = ctx.req.valid("param");

  const result = await unbanDomain(domain);

  return ctx.json(result);
}

export const adminApi_debugDomain = createRoute({
  method: "get",
  path: "/admin/debug",
  request: {
    query: domain_paramSchema,
  },
  security: [
    {
      AdminApiToken: [],
    },
  ],
  responses: {
    200: {
      description: "Debug information",
    },
  },
  tags: ["Admin"],
});

export async function adminApiHandler_debugDomain(ctx) {
  const { domain } = ctx.req.valid("query");

  const domainData = await getDomainData(domain);
  formatLogger("debugDomain/domainData", JSON.stringify(domainData));
  let kvData;

  if (domainData.subdomains !== null) {
    kvData = await kvApi.get([
      "domains",
      domainData.domain,
      domainData.subdomains,
    ]);
  } else {
    kvData = await kvApi.get(["domains", domainData.domain]);
  }

  const domainStatus = await getDomainStatus(domain);
  formatLogger("debugDomain/KvApi", kvData);

  return ctx.json({
    data: domainData,
    status: domainStatus,
    kv: kvData ?? null,
  });
}
