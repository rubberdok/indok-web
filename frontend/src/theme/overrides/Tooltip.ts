import { Theme } from "@mui/material/styles";

type Props = (theme: Theme) => Theme["components"];

const Tooltip: Props = (theme: Theme) => {
  const lightMode = theme.palette.mode === "light";

  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[lightMode ? 800 : 700],
        },
        arrow: {
          color: theme.palette.grey[lightMode ? 800 : 700],
        },
      },
    },
  };
};

export default Tooltip;
