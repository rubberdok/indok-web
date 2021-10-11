// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// eslint-disable-next-line
const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
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
};

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
