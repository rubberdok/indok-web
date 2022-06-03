import { Theme } from "@mui/material";

type Props = () => Theme["components"];

const Link: Props = () => {
  return {
    MuiLink: {
      defaultProps: {
        underline: "hover",
      },
      styleOverrides: {
        root: {
          cursor: "pointer",
        },
      },
    },
  };
};

export default Link;
