import { ComponentOverride } from "./types";

const Radio: ComponentOverride = (theme) => {
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
