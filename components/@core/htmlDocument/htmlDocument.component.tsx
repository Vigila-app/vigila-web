/* eslint-disable @next/next/no-head-element */
/* eslint-disable @next/next/no-sync-scripts */
import { Poppins } from "next/font/google";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Script from "next/script";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const SkipContentComponent = dynamic(
  () => import("@/components/@core/skipContent/skipContent.component"),
  { ssr: !!false },
);

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

type HtmlDocumentI = {
  otherHead?: React.ReactNode;
  otherBody?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
};

const HtmlDocument = (props: HtmlDocumentI) => {
  const { otherHead, otherBody, children, footer, header } = props;
  return (
    <>
      <html lang="en" className="scroll-smooth cursor-default">
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossOrigin=""
          />
          <script
            src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
            crossOrigin=""
          ></script>
          {GTM_ID && (
            <Script
              id="gtm-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
              }}
            />
          )}
          {otherHead}
        </head>
        <body className={clsx(poppins.className, "overflow-x-hidden")}>
          {GTM_ID && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          )}
          <SkipContentComponent />
          {header}
          <main id="MainContent" className="min-h-screen">
            {children}
          </main>
          {footer}
          {otherBody}
        </body>
      </html>
    </>
  );
};

export default HtmlDocument;
