import { MetadataRoute } from "next";
import Routes from "@/src/assets/routes-it.json";
import { AppConstants } from "@/src/constants";

const forcedRoutes: MetadataRoute.Sitemap = [];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = Object.values(Routes)
    .filter((route) => {
      // @ts-ignore
      if (route?.seo?.index === false || route?.private) {
        return;
      } else {
        return route;
      }
    })
    .map((route) => ({
      url: `${AppConstants.hostUrl}${route.url}`,
      lastModified: new Date(),
      // @ts-ignore
      changeFrequency: route.seo?.changeFrequency || "monthly",
      // @ts-ignore
      priority: route.seo?.priority || 0.8,
    }));

  const calculatedRoutes: MetadataRoute.Sitemap = [];

  return [...forcedRoutes, ...routes, ...calculatedRoutes].filter(
    (value, index, self) => index === self.findIndex((t) => t.url === value.url)
  );
}
