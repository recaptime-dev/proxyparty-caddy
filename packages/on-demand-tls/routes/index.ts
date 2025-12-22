import type { OpenAPIHono } from "@hono/zod-openapi";
import { pubApi_checkDomain, pubApiHandler_checkDomain } from "./pubApi.ts";
import {
  adminApi_banDomain,
  adminApiHandler_banDomain,
  adminApi_unbanDomain,
  adminApiHandler_unbanDomain
} from "./admin.ts";

export function registerRoutes(app: OpenAPIHono) {
    app.openapi(pubApi_checkDomain, pubApiHandler_checkDomain);
    app.openapi(adminApi_banDomain, adminApiHandler_banDomain);
    app.openapi(adminApi_unbanDomain, adminApiHandler_unbanDomain);
}
