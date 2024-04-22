import { ThemeOptions } from "@mui/material";

export const Card: ThemeOptions["components"] = {
  MuiCard: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.vars.palette.background.elevated,
        borderRadius: Number(theme.shape.borderRadius) * 2,
      }),
    },
  },
  MuiCardHeader: {
    defaultProps: {
      titleTypographyProps: { variant: "subtitle1" },
      subheaderTypographyProps: { variant: "body2" },
    },
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(3, 3, 0),
      }),
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(3),
      }),
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(0, 3, 3),
      }),
    },
  },
};
