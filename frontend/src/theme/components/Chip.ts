import { ThemeOptions } from "@mui/material";

export const Chip: ThemeOptions["components"] = {
  MuiChip: {
    styleOverrides: {
      root: {
        minWidth: 32,
      },
      outlined: ({ theme }) => ({
        borderColor: theme.vars.palette.grey[500],
        "&.MuiChip-colorPrimary": {
          borderColor: theme.vars.palette.primary.main,
        },
        "&.MuiChip-colorSecondary": {
          borderColor: theme.vars.palette.secondary.main,
        },
      }),
      //
      avatar: ({ theme }) => ({
        fontSize: theme.typography.subtitle2.fontSize,
        fontWeight: theme.typography.fontWeightMedium,
      }),
    },
  },
};
