import { alpha, ThemeOptions } from "@mui/material/styles";

const Popover: ThemeOptions["components"] = {
  MuiPopover: {
    defaultProps: {
      elevation: 24,
    },
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: Number(theme.shape.borderRadius) * 1.5,
        border: `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
      }),
    },
  },
};

export default Popover;
