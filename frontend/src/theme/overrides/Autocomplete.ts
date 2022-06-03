import { Theme } from "@mui/material/styles";
import typography from "../typography";

type Props = (theme: Theme) => Theme["components"];

const Autocomplete: Props = (theme) => {
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
          ...typography.body2,
          borderRadius: theme.shape.borderRadius,
        },
      },
    },
  };
};

export default Autocomplete;
