/* eslint-disable @next/next/no-head-element */
/* eslint-disable @next/next/no-sync-scripts */
import { Inter } from "next/font/google";
import clsx from "clsx";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

const SkipContentComponent = dynamic(
  () => import("@/components/@core/skipContent/skipContent.component"),
  { ssr: !!false }
);

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
          <link rel="manifest" href="/manifest.json"/>
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
          {otherHead}
        </head>
        <body className={clsx(inter.className, "overflow-x-hidden")}>
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
