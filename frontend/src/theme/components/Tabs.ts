import { ThemeOptions } from "@mui/material";

const Tabs: ThemeOptions["components"] = {
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

export default Tabs;
