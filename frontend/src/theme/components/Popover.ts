import { alpha, ThemeOptions } from "@mui/material/styles";

export const Popover: ThemeOptions["components"] = {
  MuiPopover: {
    defaultProps: {
      elevation: 24,
    },
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: Number(theme.shape.borderRadius) * 1.5,
        border: `solid 1px ${alpha(theme.vars.palette.grey[500], 0.08)}`,
      }),
    },
  },
};
