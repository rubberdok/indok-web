import { ThemeOptions } from "@mui/material";

export const Progress: ThemeOptions["components"] = {
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        overflow: "hidden",
      },
      bar: {
        borderRadius: 4,
      },
      buffer: {
        backgroundColor: "transparent",
      },
    },
  },
};
