export type RouteI = {
  label: string;
  title?: string;
  id?: string;
  url: string;
  target?: "_blank" | "_self" | string;
  matchingUrl?: string;
  parents?: string[];
  menu?: {
    mobile: boolean;
    desktop: boolean;
    header: boolean;
    footer: boolean;
  };
  private: boolean;
  roles: string[];
  seo?: {
    index?: boolean;
    changeFrequency?: string;
    priority?: number;
  };
};

export type RoutesI = {
  [route: string]: RouteI;
};
