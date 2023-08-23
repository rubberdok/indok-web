import { ThemeOptions } from "@mui/material";

export const Alert: ThemeOptions["components"] = {
  MuiAlert: {
    styleOverrides: {
      root: {
        lineHeight: "normal",
      },
    },
  },
};
