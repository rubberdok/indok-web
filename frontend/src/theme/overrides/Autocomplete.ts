import { experimental_sx as sx } from "@mui/material";
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
        option: sx({
          borderRadius: theme.shape.borderRadius,
          typography: theme.typography.body2,
        }),
      },
    },
  };
};

export default Autocomplete;
