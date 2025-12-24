import { createRoute, z } from "@hono/zod-openapi";
import { getDomainStatus } from "../kv.ts";
import { domain_paramSchema } from "./admin.ts";

export const DomainStatusSchema = z.object({
  status: z.enum(["allowed", "blocked", "invalid_domain", "not_found"]),
  reason: z.string().optional(),
});

export const pubApi_checkDomain = createRoute({
  method: "get",
  summary:
    "Check if a domain is allowed to be used with Proxyparty for On-demand TLS.",
  description: `\
If allowed, it will return a 200 status code with a JSON response stating that Proxyparty can issue TLS certificates \
for the domain on demand. Otherwise, it will return a 403 status code with a JSON response stating the reason for the block.

See [the Caddy documentation](https://caddyserver.com/docs/automatic-https#on-demand-tls) and the
[community wiki](https://caddy.community/t/serving-tens-of-thousands-of-domains-over-https-with-caddy/11179) for more information.
    `,
  path: "/check",
  request: {
    query: domain_paramSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: DomainStatusSchema,
        },
      },
      description: "Domain status response",
    },
  },
  tags: ["Caddy / Public Endpoints"],
});

export async function pubApiHandler_checkDomain(c: any /* Context */) {
  const { domain } = c.req.valid("query");
  const statusResult = await getDomainStatus(domain);

  if (statusResult.status === "allowed") {
    return c.json({
      status: statusResult.status,
      reason: "Proxyparty can be used with this domain.",
    });
  } else if (statusResult.status === "not_found") {
    return c.json(statusResult, 404);
  } else {
    return c.json(statusResult, 403);
  }
}
