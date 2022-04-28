import { Theme } from "@mui/system";

type Props = () => Theme["components"];

const Container: Props = () => {
  return {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
  };
};

export default Container;
