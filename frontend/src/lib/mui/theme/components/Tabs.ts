import { ThemeOptions } from "@mui/material";

export const Tabs: ThemeOptions["components"] = {
  MuiTab: {
    defaultProps: {
      disableRipple: true,
    },

    styleOverrides: {
      wrapped: {
        flexDirection: "row",
        whiteSpace: "nowrap",
      },
    },
  },
};
