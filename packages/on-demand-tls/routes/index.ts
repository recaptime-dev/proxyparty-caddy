import type { OpenAPIHono } from "@hono/zod-openapi";
import { pubApi_checkDomain, pubApiHandler_checkDomain } from "./pubApi.ts";
import {
  adminApi_banDomain,
  adminApi_debugDomain,
  adminApi_removeDomain,
  adminApi_unbanDomain,
  adminApiHandler_banDomain,
  adminApiHandler_debugDomain,
  adminApiHandler_removeDomain,
  adminApiHandler_unbanDomain,
} from "./admin.ts";

export function registerRoutes(app: OpenAPIHono) {
  app.openapi(pubApi_checkDomain, pubApiHandler_checkDomain);
  app.openapi(adminApi_banDomain, adminApiHandler_banDomain);
  app.openapi(adminApi_unbanDomain, adminApiHandler_unbanDomain);
  app.openapi(adminApi_removeDomain, adminApiHandler_removeDomain);
  app.openapi(adminApi_debugDomain, adminApiHandler_debugDomain);
}
