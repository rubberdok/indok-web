import { ThemeOptions } from "@mui/material";

export const ControlLabel: ThemeOptions["components"] = {
  MuiFormControlLabel: {
    styleOverrides: {
      label: ({ theme }) => ({
        ...theme.typography.body2,
      }),
    },
  },
  MuiFormHelperText: {},
  MuiFormLabel: {},
};
