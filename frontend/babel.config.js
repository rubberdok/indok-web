const getPresets = (options = {}) => ({
  presets: options.presets || ["next/babel"],
  plugins: [["styled-components", { ssr: true, displayName: true, preprocess: false }], ...(options.plugins || [])],
});

module.exports = {
  env: {
    production: getPresets({
      plugins: [["react-remove-properties", { properties: ["data-test-id"] }], "transform-remove-console"],
    }),
    development: getPresets(),
    test: getPresets(),
  },
};
