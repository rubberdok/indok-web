import { ThemeOptions } from "@mui/material";

const Paper: ThemeOptions["components"] = {
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
    },
  },
};

export default Paper;
