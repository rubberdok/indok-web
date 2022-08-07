// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// eslint-disable-next-line
const { withSentryConfig } = require("@sentry/nextjs");

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

const moduleExports = {
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
  experimental: {
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
      lodash: {
        transform: "lodash/{{member}}",
      },
    },
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
  /* Browser source maps should be enabled during production to upload to Sentry  */
  productionBrowserSourceMaps: process.env.NEXT_PUBLIC_APP_ENV === "production",
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports);
