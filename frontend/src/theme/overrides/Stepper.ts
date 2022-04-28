import { Theme } from "@mui/material/styles";

const Stepper: any = (theme: Theme) => {
  return {
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: theme.palette.divider,
        },
      },
    },
  };
};

export default Stepper;
