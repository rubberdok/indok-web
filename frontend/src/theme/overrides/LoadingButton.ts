import { ComponentOverride } from "./types";

const LoadingButton: ComponentOverride = () => {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          "& .MuiLoadingButton-text": {
            "& .MuiLoadingButton-startIcon": {
              marginLeft: 0,
            },
            "& .MuiLoadingButton-endIcon": {
              marginRight: 0,
            },
          },
        },
      },
    },
  };
};

export default LoadingButton;
