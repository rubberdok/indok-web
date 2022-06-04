import { ComponentOverride } from "./types";

const Stepper: ComponentOverride = (theme: Theme) => {
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
