module.exports = {
  async rewrites() {
    return [
      {
        source: "/varsle",
        destination: "/report",
      },
    ];
  },
};
