import { ThemeOptions } from "@mui/material";

const Slider: ThemeOptions["components"] = {
  MuiSlider: {
    defaultProps: {
      size: "small",
    },

    styleOverrides: {
      markLabel: ({ theme }) => ({
        fontSize: 13,
        color: theme.palette.text.disabled,
      }),
      valueLabel: ({ theme }) => ({
        borderRadius: 8,
        backgroundColor: theme.palette.grey[800],
      }),
    },
  },
};

export default Slider;
