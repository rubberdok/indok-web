import { ComponentOverride } from "./types";

const Container: ComponentOverride = () => {
  return {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
  } as const;
};

export default Container;
