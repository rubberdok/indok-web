import { ThemeOptions } from "@mui/material";

const Stepper: ThemeOptions["components"] = {
  MuiStepConnector: {
    styleOverrides: {
      line: ({ theme }) => ({
        borderColor: theme.palette.divider,
      }),
    },
  },
};

export default Stepper;
