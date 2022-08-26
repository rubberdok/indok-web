import { ThemeOptions } from "@mui/material";

const Tooltip: ThemeOptions["components"] = {
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

export default Tooltip;
