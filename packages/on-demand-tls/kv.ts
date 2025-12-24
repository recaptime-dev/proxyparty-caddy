export const kvApi = await Deno.openKv();
import { parseDomain } from "parse-domain";
import { getDomainData } from "./utils.ts";

export type SubdomainInfo = {
  status: "allowed" | "blocked";
  block_reason?: string;
  blocked_at?: number;
  last_updated: number;
  created_at: number;
};

export type DomainInfo = SubdomainInfo & {
  include_subdomains?: boolean;
};

export async function getDomainStatus(domain: string): Promise<{
  status: DomainInfo["status"] | "invalid_domain" | "not_found";
  reason?: string;
}> {
  const validDomain = getDomainData(domain);
  if (!validDomain.is_valid) {
    return {
      status: "invalid_domain",
      reason: "Domain format is invalid",
    };
  }

  const result =
    (await kvApi.get<DomainInfo>(["domains", validDomain.domain!])).value;

  if (validDomain.subdomains) {
    const subData = await getSubdomainsStatus(
      validDomain.domain!,
      validDomain.subdomains,
    );
    if (subData) {
      return { status: subData.status, reason: subData.block_reason };
    } else {
      if (result?.include_subdomains === true) {
        return { status: result.status, reason: result.block_reason };
      } else {
        return {
          status: "not_found",
          reason:
            "Subdomain not found (ask @recaptime-dev/squad to allowlist the subdomain)",
        };
      }
    }
  } else {
    if (result !== null) {
      return { status: result.status, reason: result.block_reason };
    } else {
      return {
        status: "not_found",
        reason:
          "Domain not found (ask @recaptime-dev/squad to allowlist the domain)",
      };
    }
  }
}

export async function getSubdomainsStatus(domain: string, subdomain: string) {
  const result = await kvApi.get<SubdomainInfo>(["domains", domain, subdomain]);

  return result.value;
}

export async function banDomain(
  domain: string,
  reason: string,
  include_subdomains?: boolean,
) {
  const metadata = getDomainData(domain);
  let dbKey: Array<string>;
  const currentData = (await kvApi.get<DomainInfo>(["domains", domain])).value;

  if (metadata === null) {
    return { ok: false, versionstamp: undefined };
  } else if (metadata.subdomains) {
    dbKey = ["domains", metadata.domain, metadata.subdomains];
  } else {
    dbKey = ["domains", domain];
  }

  const domainInfo: DomainInfo = {
    status: "blocked",
    block_reason: reason,
    blocked_at: Date.now(),
    last_updated: Date.now(),
    created_at: Date.now(),
    include_subdomains: include_subdomains || false,
  };

  if (currentData !== null) {
    domainInfo.blocked_at = currentData.blocked_at;
    domainInfo.created_at = currentData.created_at ?? Date.now();
    domainInfo.last_updated = currentData.last_updated ?? Date.now();
    domainInfo.include_subdomains = currentData.include_subdomains || false;
  }

  return await kvApi.set(dbKey, domainInfo);
}

export async function unbanDomain(domain: string) {
  const metadata = getDomainData(domain);
  let dbKey: Array<string>;

  if (metadata === null) {
    return { ok: false, versionstamp: undefined };
  } else if (metadata.subdomains) {
    dbKey = ["domains", metadata.domain, metadata.subdomains];
  } else {
    dbKey = ["domains", domain];
  }

  const currentData = await kvApi.get<DomainInfo>(dbKey);

  if (currentData === null) {
    return { ok: false, versionstamp: undefined };
  }

  if (currentData !== null && currentData.value.status !== "blocked") {
    return { ok: true, versionstamp: currentData.versionstamp };
  }

  if (currentData !== null && currentData.value.status === "blocked") {
    const domainInfo: DomainInfo = {
      status: "allowed",
      blocked_at: undefined,
      block_reason: undefined,
      last_updated: Date.now(),
      created_at: currentData.value.created_at ?? Date.now(),
      include_subdomains: currentData.value.include_subdomains ?? false,
    };
    return await kvApi.set(dbKey, domainInfo);
  }
}

export async function removeDomain(domain: string) {
  const metadata = getDomainData(domain);
  let dbKey: Array<string>;

  if (metadata === null) {
    return { ok: false, versionstamp: undefined };
  } else if (metadata.subdomains) {
    dbKey = ["domains", metadata.domain, metadata.subdomains];
  } else {
    dbKey = ["domains", domain];
  }

  return await kvApi.delete(dbKey);
}
