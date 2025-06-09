/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

const commonConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 180,
    },
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...defaultConfig,
      ...commonConfig,
    };
  }

  return {
    ...defaultConfig,
    ...commonConfig,
    redirects: () => [
      {
        source: "/playground",
        destination: "/",
        permanent: true,
      },
    ],
    async headers() {
      return [
        {
          source: "/push/oneSignal",
          headers: [
            {
              key: "Service-Worker-Allowed",
              value: "/",
            },
          ],
        },
      ];
    },
  };
};
