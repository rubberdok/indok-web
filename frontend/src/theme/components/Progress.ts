import { ThemeOptions } from "@mui/material";

const Progress: ThemeOptions["components"] = {
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

export default Progress;
