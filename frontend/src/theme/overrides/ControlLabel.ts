import { Theme } from "@mui/material/styles";
import typography from "../typography";

type Props = (theme: Theme) => Theme["components"];

const ControlLabel: Props = (theme) => {
  return {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          ...typography.body2,
        },
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
