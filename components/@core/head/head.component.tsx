/* eslint-disable @next/next/no-head-element */
import { THeadProps } from "@/src/types/head.types";
import { AppConstants } from "@/src/constants";

const HeadComponent = ({ description, title }: THeadProps) => {
  const metaTitle = title
    ? `${title} | ${AppConstants.title}`
    : AppConstants.title;
  const metaDescription = description || AppConstants.description || "";

  return (
    <head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />

      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      {/* TODO: add site image such as Logo */}
      {/*<meta
        property="og:image"
        content="https://example.com/images/cool-page.jpg"
      />*/}

      {/* TODO: change favicon */}
      <link rel="icon" href="/favicon.ico" />
    </head>
  );
};

export default HeadComponent;
