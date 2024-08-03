type routes = {
  path: string;
  target?: string;
};

type subdomain = {
  target?: string;
  isBaseUrl?: boolean;
  disabled?: boolean;
  disablement_reason?: string | null;
  routes: routes[];
};

export type redirectData = {
  target?: string;
  isBaseUrl?: boolean;
  disabled?: boolean;
  disablement_reason?: string | null;
  routes?: routes[];
  subdomains: Record<string, subdomain>
};
