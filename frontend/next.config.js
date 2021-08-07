module.exports = {
  async rewrites() {
    return [
      {
        source: "/report",
        destination: "/reports",
      },
      {
        source: "/varsler",
        destination: "/reports",
      },
      {
        source: "/varsle",
        destination: "/reports",
      },
      {
        source: "/varslinger",
        destination: "/reports",
      },
    ];
  },
};
