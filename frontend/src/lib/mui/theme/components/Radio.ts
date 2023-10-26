import { ThemeOptions } from "@mui/material";

export const Radio: ThemeOptions["components"] = {
  MuiRadio: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(1),
      }),
    },
  },
};
