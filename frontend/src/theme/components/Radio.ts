import { ThemeOptions } from "@mui/material";

const Radio: ThemeOptions["components"] = {
  MuiRadio: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(1),
      }),
    },
  },
};

export default Radio;
