// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// eslint-disable-next-line
const { withSentryConfig } = require("@sentry/nextjs");

const getPresets = () => {
  if (process.env.NEXT_PUBLIC_APP_ENV == "production") {
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

  experimental: {
    outputStandalone: true,
  },
  webpack: (config, { isServer }) => {
    // In `pages/_app.js`, Sentry is imported from @sentry/browser. While
    // @sentry/node will run in a Node.js environment. @sentry/node will use
    // Node.js-only APIs to catch even more unhandled exceptions.
    //
    // This works well when Next.js is SSRing your page on a server with
    // Node.js, but it is not what we want when your client-side bundle is being
    // executed by a browser.
    //
    // Luckily, Next.js will call this webpack function twice, once for the
    // server and once for the client. Read more:
    // https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
    //
    // So ask Webpack to replace @sentry/node imports with @sentry/browser when
    // building the browser's bundle
    if (!isServer) {
      config.resolve.alias["@sentry/node"] = "@sentry/browser";
    }
    return config;
  },
  sentry: {
    // Disable the Sentry CLI and manually manage releases and source maps
    // To make Sentry work more nicely with CI/CD, as build != release for us.
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
  },
  productionBrowserSourceMaps: process.env.NEXT_PUBLIC_APP_ENV === "production",
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports);
