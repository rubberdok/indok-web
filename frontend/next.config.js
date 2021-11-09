// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// eslint-disable-next-line
const { withSentryConfig } = require("@sentry/nextjs");
const { config } = require("process");

const moduleExports = {
  /** @todo internationalized routing */
  async rewrites() {
    return [
      {
        source: "/varsle",
        destination: "/report",
      },
    ];
  },
  sentry: {
    // Disable the Sentry CLI and manually manage releases and source maps
    // To make Sentry work more nicely with CI/CD, as build != release for us.
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
  },
  productionBrowserSourceMaps: config.APP_ENV === "production",
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports);
