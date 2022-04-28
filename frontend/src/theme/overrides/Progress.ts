import { Theme } from "@mui/material/styles";

const Progress: any = (theme: Theme) => {
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
