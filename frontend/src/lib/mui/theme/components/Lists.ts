import { ThemeOptions } from "@mui/material";

export const Lists: ThemeOptions["components"] = {
  MuiListItemIcon: {
    defaultProps: {
      color: "inherit",
    },
    styleOverrides: {
      root: ({ theme }) => ({
        minWidth: "auto",
        marginRight: theme.spacing(2),
      }),
    },
  },
  MuiListItemAvatar: {
    styleOverrides: {
      root: ({ theme }) => ({
        minWidth: "auto",
        marginRight: theme.spacing(2),
      }),
    },
  },
  MuiListItemText: {
    styleOverrides: {
      root: {
        marginTop: 0,
        marginBottom: 0,
      },
      multiline: {
        marginTop: 0,
        marginBottom: 0,
      },
    },
  },
};
