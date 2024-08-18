import { MiddlewareHandler } from "jsr:@hono/hono@^4.5.3/types";

export const poweredBy = (): MiddlewareHandler => {
  return async function poweredBy(c, next) {
    await next();
    c.res.headers.set("X-Powered-By", "proxyparty.recaptime.dev");
  };
};

/**
 * 
 * @param {string} url 
 * @returns {string} A string of the subdomain
 * @description Copied from https://nesin.io/blog/subdomain-from-url-javascript
 */
export const getSubdomain = (url: string) => {
  let domain = url;
  if (url.includes("://")) {
    domain = url.split("://")[1];
  }
  const subdomain = domain.split(".")[0];
  return subdomain;
};