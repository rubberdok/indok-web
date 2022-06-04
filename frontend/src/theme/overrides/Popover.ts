import { alpha, Theme } from "@mui/material/styles";

const Popover: ComponentOverride = (theme: Theme) => {
  return {
    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.z24,
          borderRadius: Number(theme.shape.borderRadius) * 1.5,
          border: `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
        },
      },
    },
  };
};

export default Popover;
