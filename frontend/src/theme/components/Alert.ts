import { ThemeOptions } from "@mui/material";

const Alert: ThemeOptions["components"] = {
  MuiAlert: {
    styleOverrides: {
      root: {
        lineHeight: "normal",
      },
    },
  },
};

export default Alert;
