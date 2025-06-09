export type RouteI = {
  label: string;
  title?: string;
  url: string;
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
    changeFrequency: string;
    priority: number;
  };
};

export type RoutesI = {
  [route: string]: RouteI;
};
