import React from "react";
import { ComponentOverride } from "./types";

const Autocomplete: ComponentOverride = (theme) => {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
          boxShadow: theme.customShadows.z24,
          borderRadius: Number(theme.shape.borderRadius) * 2,
        },
        option: {
          borderRadius: theme.shape.borderRadius,
          ...(theme.typography.body2 as React.CSSProperties),
        },
      },
    },
  };
};

export default Autocomplete;
