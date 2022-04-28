import { Theme } from "@mui/material/styles";

type Props = (theme: Theme) => any;

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
          ...theme.typography.body2,
          borderRadius: theme.shape.borderRadius,
        },
      },
    },
  };
};

export default Autocomplete;
