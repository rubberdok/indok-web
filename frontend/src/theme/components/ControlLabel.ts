import { ThemeOptions } from "@mui/material";

const ControlLabel: ThemeOptions["components"] = {
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

export default ControlLabel;
