import { ThemeOptions } from "@mui/material";

export const Card: ThemeOptions["components"] = {
  MuiCard: {
    defaultProps: {
      elevation: 8,
    },
    styleOverrides: {
      root: ({ theme }) => ({
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
};
