import { ComponentOverride } from "./types";

const Link: ComponentOverride = () => {
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
