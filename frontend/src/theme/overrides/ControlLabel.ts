import { experimental_sx as sx } from "@mui/material";
import { ComponentOverride } from "./types";

const ControlLabel: ComponentOverride = (theme) => {
  return {
    MuiFormControlLabel: {
      styleOverrides: {
        label: sx({
          typography: theme.typography.body2,
        }),
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: theme.spacing(1),
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.disabled,
        },
      },
    },
  };
};

export default ControlLabel;
