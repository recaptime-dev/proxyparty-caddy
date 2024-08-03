import { MiddlewareHandler } from "jsr:@hono/hono@^4.5.3/types";

export const poweredBy = (): MiddlewareHandler => {
  return async function poweredBy(c, next) {
    await next();
    c.res.headers.set("X-Powered-By", "proxyparty.recaptime.dev");
  };
};
