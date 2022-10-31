import { ThemeOptions } from "@mui/material";

export const Stepper: ThemeOptions["components"] = {
  MuiStepConnector: {
    styleOverrides: {
      line: ({ theme }) => ({
        borderColor: theme.palette.divider,
      }),
    },
  },
};
