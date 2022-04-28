import { alpha, Theme } from "@mui/material/styles";

type Props = (theme: Theme) => Theme["components"];

const Button: Props = (theme) => {
  const lightMode = theme.palette.mode === "light";

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        sizeLarge: {
          height: 48,
        },
        containedInherit: {
          color: lightMode ? theme.palette.common.white : theme.palette.grey[800],
          backgroundColor: lightMode ? theme.palette.grey[800] : theme.palette.common.white,
          "&:hover": {
            backgroundColor: lightMode ? theme.palette.grey[700] : theme.palette.grey[400],
          },
        },
        outlinedInherit: {
          borderColor: alpha(theme.palette.grey[500], 0.32),
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
            borderColor: theme.palette.text.primary,
          },
        },
        textInherit: {
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
      },
    },
  };
};

export default Button;
