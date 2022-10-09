import { ThemeOptions } from "@mui/material";

export const Link: ThemeOptions["components"] = {
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
