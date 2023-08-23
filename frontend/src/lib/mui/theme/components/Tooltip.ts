import { ThemeOptions } from "@mui/material";

export const Tooltip: ThemeOptions["components"] = {
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        backgroundColor: theme.vars.palette.grey[800],
      }),
      arrow: ({ theme }) => ({
        color: theme.vars.palette.grey[800],
      }),
    },
  },
};
