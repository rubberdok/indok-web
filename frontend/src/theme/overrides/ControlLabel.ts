import React from "react";
import { ComponentOverride } from "./types";

const ControlLabel: ComponentOverride = (theme) => {
  return {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          ...(theme.typography.body2 as React.CSSProperties),
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
