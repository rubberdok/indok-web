import { alpha, ThemeOptions } from "@mui/material/styles";

const Button: ThemeOptions["components"] = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },

    styleOverrides: {
      root: ({ theme, ownerState }) => ({
        "&.MuiButton-outlinedInherit": {
          borderColor: alpha(ownerState.style?.color ?? theme.palette.text.primary, 0.32),
        },
        "&.MuiButton-outlinedPrimary": {
          borderColor: alpha(theme.palette.primary.main, 0.32),
        },
        "&.MuiButton-outlinedSecondary": {
          borderColor: alpha(theme.palette.secondary.main, 0.32),
        },
        textTransform: "none",
        "& .MuiLoadingButton-text": {
          "& .MuiLoadingButton-startIcon": {
            marginLeft: 0,
          },
          "& .MuiLoadingButton-endIcon": {
            marginRight: 0,
          },
        },
      }),
    },
  },
};

export default Button;
