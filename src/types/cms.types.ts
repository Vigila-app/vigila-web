export type CmsPageHeroI = {
  title?: string;
  subtitle?: string;
  payoff?: string;
  cta?: {
    label?: string;
    url?: string;
    type?: string;
  }[];
};

export type CmsPageFormI = {
  title?: string;
  text?: string;
  fields?: {
    id: string;
    label?: string;
    text?: string;
    type?: "text" | "number" | "term" | "toggle";
    required?: boolean;
  }[];
};

export type CmsPageI = {
  title?: string;
  text?: string;
  "main-hero"?: CmsPageHeroI;
  html?: string;
  form?: CmsPageFormI;
};
