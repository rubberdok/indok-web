import { ThemeOptions } from "@mui/material";

export const Paper: ThemeOptions["components"] = {
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
    },
  },
};
