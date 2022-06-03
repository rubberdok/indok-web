import { Theme } from "@mui/material/styles";

type Props = (theme: Theme) => Theme["components"];

const Progress: Props = (theme: Theme) => {
  const lightMode = theme.palette.mode === "light";

  return {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          overflow: "hidden",
        },
        bar: {
          borderRadius: 4,
        },
        colorPrimary: {
          backgroundColor: theme.palette.primary[lightMode ? "lighter" : "darker"],
        },
        buffer: {
          backgroundColor: "transparent",
        },
      },
    },
  };
};

export default Progress;
