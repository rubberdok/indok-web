import { Theme } from "@mui/system";

const Container = () => {
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
