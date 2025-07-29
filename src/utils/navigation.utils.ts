import { Routes } from "@/src/routes";
import { RouteI } from "@/src/types/route.types";

const getFooterMenu = (privateRoutes: boolean = false) => {
  return Object.values(Routes)
    .filter(({ menu }) => menu?.footer)
    .filter(({ private: isPrivate }) =>
      privateRoutes ? isPrivate : !isPrivate
    );
};

const getHeaderMenu = (privateRoutes: boolean = false) => {
  return Object.values(Routes)
    .filter(({ menu }) => menu?.header)
    .filter(({ private: isPrivate }) =>
      privateRoutes ? isPrivate : !isPrivate
    );
};

const getRouteByUrl = (routeUrl: RouteI["url"]) => {
  return Object.values(Routes).find(
    ({ matchingUrl, url }) =>
      url === routeUrl ||
      (matchingUrl ? routeUrl?.includes(matchingUrl) : false)
  );
};

const getRouteByKey = (routeKey: string) => {
  return Routes[routeKey];
};
export const NavigationUtils = {
  getFooterMenu,
  getHeaderMenu,
  getRouteByUrl,
  getRouteByKey,
};
