import { ComponentOverride } from "./types";

const Stepper: ComponentOverride = (theme) => {
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
