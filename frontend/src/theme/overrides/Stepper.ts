import { Theme } from "@mui/material/styles";

type Props = (theme: Theme) => Theme["components"];

const Stepper: Props = (theme: Theme) => {
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
