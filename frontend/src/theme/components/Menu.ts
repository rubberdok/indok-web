import { ThemeOptions } from "@mui/material";

export const Menu: ThemeOptions["components"] = {
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.body2,
      }),
    },
  },
};
