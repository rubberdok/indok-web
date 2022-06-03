import { Theme } from "@mui/material";

type Props = () => Theme["components"];

const Paper: Props = () => {
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
