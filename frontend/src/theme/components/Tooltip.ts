import { ThemeOptions } from "@mui/material";

export const Tooltip: ThemeOptions["components"] = {
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        backgroundColor: theme.palette.grey[800],
      }),
      arrow: ({ theme }) => ({
        color: theme.palette.grey[800],
      }),
    },
  },
};
