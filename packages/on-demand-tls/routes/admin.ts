import { createRoute, z, zValidator } from "@hono/zod-openapi";
import { SubdomainInfo, DomainInfo, banDomain, unbanDomain, getDomainStatus } from "../kv.ts";
import { getDomainData } from "../utils.ts";

const admin_domainInfoSchema = z.object({
  status: z.enum(["allowed", "blocked"]),
  block_reason: z.string().optional(),
  blocked_at: z.number().optional(),
  last_updated: z.number(),
  include_subdomains: z.boolean().optional().default(false),
});

const admin_banDomainSchema = z.object({
  reason: z.string().min(1).max(255).optional(),
  include_subdomains: z.boolean().optional().default(false),
});

const admin_unbanDomainSchema = z.object({
  domain: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-zA-Z0-9.-]+$/)
    .default("example.com"),
});

export const adminApi_banDomain = createRoute({
  method: "post",
  path: "/admin/{domain}/ban",
  request: {
    params: z.object({
      domain: z.string().min(1).max(255).regex(/^[a-zA-Z0-9.-]+$/).default("example.com"),
    }),
    body: {
      content: {
        "application/json": {
          schema: admin_banDomainSchema,
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: admin_domainInfoSchema,
        }
      },
      description: "Domain information"
    }
  },
  security: [
    {
      AdminApiToken: [],
    },
  ],
  tags: ["Admin"]
});

export const adminApi_unbanDomain = createRoute({
  method: "post",
  path: "/admin/unban",
  request: {
    body: {
      content: {
        "application/json": {
          schema: admin_unbanDomainSchema,
        }
      }
    }
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
        }
      },
      description: "Domain information"
    },
  },
  tags: ["Admin"]
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

export async function adminApiHandler_unbanDomain(ctx) {
  const { domain } = ctx.req.valid("json")

  const result = await unbanDomain(domain);

  return ctx.json(result);
}
