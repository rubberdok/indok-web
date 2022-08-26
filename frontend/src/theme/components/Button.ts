import { ThemeOptions } from "@mui/material";

const Button: ThemeOptions["components"] = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        textTransform: "none",
        "& .MuiLoadingButton-text": {
          "& .MuiLoadingButton-startIcon": {
            marginLeft: 0,
          },
          "& .MuiLoadingButton-endIcon": {
            marginRight: 0,
          },
        },
      },
    },
  },
};

export default Button;
