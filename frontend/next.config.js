// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// eslint-disable-next-line
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const getPresets = () => {
  if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    return {
      // The regexes defined here are processed in Rust so the syntax is different from
      // JavaScript `RegExp`s. See https://docs.rs/regex.
      reactRemoveProperties: { properties: ["^data-test-id$"] },
      removeConsole: {
        exclude: ["error"],
      },
    };
  }
  return {};
};

/**
 * @type {import('next').NextConfig}
 */
const moduleExports = {
  reactStrictMode: true,

  /** @todo internationalized routing */
  async rewrites() {
    return [
      {
        source: "/report",
        destination: "/baksida",
      },
    ];
  },
  compiler: {
    ...getPresets(),
    /* https://nextjs.org/docs/advanced-features/compiler#emotion */
    emotion: true,
  },
  /* https://nextjs.org/docs/advanced-features/compiler#minification */
  swcMinify: true,
  /* https://nextjs.org/docs/advanced-features/output-file-tracing */
  output: "standalone",
  /**
   * https://nextjs.org/docs/advanced-features/compiler#modularize-imports
   * See https://mui.com/material-ui/guides/minimizing-bundle-size/#option-2 for reasoning.
   * In short, top level imports from "@mui/icons-material" will load the entire
   * "@mui/icons-material" package, which is a lot of code.
   * Instead, we do some compiler magic to only load the modules we need.
   */
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
    "@mui/material": {
      transform: "@mui/material/{{member}}",
    },
    "@mui/lab": {
      transform: "@mui/lab/{{member}}",
    },
    lodash: {
      transform: "lodash/{{member}}",
    },
  },
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ["indokweb-assets.s3.eu-north-1.amazonaws.com", "appstore7o8xwaka.blob.core.windows.net"],
  },
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withBundleAnalyzer(moduleExports);

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: "rbberdk",
    project: "indokweb-frontend",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
