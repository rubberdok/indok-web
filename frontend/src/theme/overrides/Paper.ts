import { ComponentOverride } from "./types";

const Paper: ComponentOverride = () => {
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },

      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  };
};

export default Paper;
