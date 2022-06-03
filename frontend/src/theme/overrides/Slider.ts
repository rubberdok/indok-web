import { Theme } from "@mui/material/styles";

type Props = (theme: Theme) => Theme["components"];

const Slider: Props = (theme: Theme) => {
  const lightMode = theme.palette.mode === "light";

  return {
    MuiSlider: {
      defaultProps: {
        size: "small",
      },

      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: theme.palette.action.disabled,
          },
        },
        markLabel: {
          fontSize: 13,
          color: theme.palette.text.disabled,
        },
        valueLabel: {
          borderRadius: 8,
          backgroundColor: theme.palette.grey[lightMode ? 800 : 700],
        },
      },
    },
  };
};

export default Slider;
