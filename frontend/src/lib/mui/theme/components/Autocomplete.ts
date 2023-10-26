import { ThemeOptions } from "@mui/material";

export const Autocomplete: ThemeOptions["components"] = {
  MuiAutocomplete: {
    styleOverrides: {
      paper: ({ theme }) => ({
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        boxShadow: theme.shadows["24"],
        borderRadius: Number(theme.shape.borderRadius) * 2,
      }),
      option: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        ...theme.typography.body2,
      }),
    },
  },
};
