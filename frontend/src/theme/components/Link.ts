import { ThemeOptions } from "@mui/material";

const Link: ThemeOptions["components"] = {
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

export default Link;
