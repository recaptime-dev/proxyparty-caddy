import { parseDomain, ParseResultType } from "parse-domain";
import { Gitlab } from "@gitbeaker/rest";

export function getDomainData(domain: string) {
  const result = parseDomain(domain);
  formatLogger("getDomainData", result);
  let is_valid: boolean = false;

  if (result.type === ParseResultType.Listed) {
    is_valid = true;
  }

  const subdomainsResult = result.subDomains?.length > 0
    ? result.subDomains.join(".")
    : "";
  const domainResult = `${result.icann.domain}.${
    result.icann.topLevelDomains ? result.icann.topLevelDomains.join(".") : ""
  }`;

  return {
    is_valid,
    subdomains: subdomainsResult !== "" ? subdomainsResult : null,
    domain: domainResult !== "" ? domainResult : null,
    parsedData: result,
  };
}

export const formatLogger = (message: string, ...rest: string[]) => {
  console.log("router: ", message, ...rest);
};

/*
 * GitLab.com user IDs of people allowed to access admin endpoints, usually those are either
 * part of @recaptime-dev/infra team (mostly @recaptime-dev/squad by default) or trusted community contributors.
 */
const apiAdmins = [
  4494641,
];

export const isAdminUser = async (token: string): Promise<boolean> => {
  if (!token) return false;

  const gitlab = new Gitlab({
    token,
  });

  try {
    const user = await gitlab.Users.current();
    return apiAdmins.includes(user?.id);
  } catch (err) {
    console.error("Error fetching GitLab user:", err);
    return false;
  }
};

export const allowlistedDomains = [
  "recaptime.dev",
  "recaptime.eu.org",
  "stellapent.wiki",
  "lorebooks.wiki",
  "lorebooks.eu.org",
  "hackclub.community",
  "dino.icu",
  "andreijiroh.dev",
  "andreijiroh.eu.org",
  "rtdevcdn.net.eu.org",
];
