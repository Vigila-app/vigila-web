"use client";

import dynamic from "next/dynamic";

const CookieBannerComponent = dynamic(
  () => import("@/components/@core/cookieBanner/cookie-banner.component"),
  { ssr: false }
);

const PartnerCookieBanner = () => <CookieBannerComponent />;

export default PartnerCookieBanner;
