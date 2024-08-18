
type baseDomainConfig = {
  target?: string | null;
  isBaseUrl?: boolean;
  disabled?: boolean;
  disablement_reason?: string | null;
  wildcardRedirect?: boolean;
  srcUrlAsQueryParam?: boolean;
  queryParamName?: string
};

type subdomain = baseDomainConfig & {
  routes?: Record<string, baseDomainConfig>;
};

export type redirectData = baseDomainConfig & {
  routes?: Record<string, baseDomainConfig>
  subdomains: Record<string, subdomain>
};
