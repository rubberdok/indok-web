import { ThemeOptions } from "@mui/material/styles";

const Button: ThemeOptions["components"] = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        textTransform: "none",
      },
    },
  },
};

export default Button;
