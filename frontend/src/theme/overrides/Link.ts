const Link: any = () => {
  return {
    MuiLink: {
      defaultProps: {
        underline: "hover",
      },

      styleOverrides: {
        root: {
          cursor: "pointer",
        },
      },
    },
  };
};

export default Link;
