import { Theme } from "@mui/material/styles";

type Props = (theme: Theme) => Theme["components"];

const Radio: Props = (theme: Theme) => {
  return {
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
          svg: {
            fontSize: 24,
            "&[font-size=small]": {
              fontSize: 20,
            },
          },
        },
      },
    },
  };
};

export default Radio;
