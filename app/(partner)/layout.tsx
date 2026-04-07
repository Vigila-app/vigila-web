import "@/app/globals.css";
import { Metadata } from "next";
import { AppConstants } from "@/src/constants";
import HtmlDocument from "@/components/@core/htmlDocument/htmlDocument.component";
import { isMocked } from "@/src/utils/envs.utils";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import CommonScript from "@/components/@core/commonScript/common-script.component";
import PartnerCookieBanner from "@/components/partner/PartnerCookieBanner";

export const metadata: Metadata = {
  title: {
    template: `%s | ${AppConstants.title}`,
    default: AppConstants.title,
  },
  description: AppConstants.description,
  openGraph: {
    title: {
      template: `%s | ${AppConstants.title}`,
      default: AppConstants.title,
    },
    description: AppConstants.description,
  },
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HtmlDocument
      otherHead={
        <>
          <CommonScript />
        </>
      }
      otherBody={
        <>
          <PartnerCookieBanner />
          {!isMocked ? (
            <>
              <SpeedInsights />
              <Analytics />
            </>
          ) : null}
        </>
      }
    >
      {children}
    </HtmlDocument>
  );
}
