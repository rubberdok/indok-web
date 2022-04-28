import { alpha, Theme } from "@mui/material/styles";
import { ColorSchema } from "../../theme/palette";

const ToggleButton: any = (theme: Theme) => {
  const styleSelected = (color: ColorSchema) => ({
    props: { color },
    style: {
      "&.Mui-selected": {
        borderColor: alpha(theme.palette[color].main, 0.48),
      },
    },
  });

  return {
    MuiToggleButton: {
      defaultProps: {
        color: "primary",
      },

      variants: [
        styleSelected("primary"),
        styleSelected("secondary"),
        styleSelected("info"),
        styleSelected("success"),
        styleSelected("warning"),
        styleSelected("error"),
      ],

      styleOverrides: {
        root: {
          color: theme.palette.text.primary,
          "& svg": { width: 24, height: 24 },
        },
      },
    },

    MuiToggleButtonGroup: {
      defaultProps: {
        color: "primary",
      },

      styleOverrides: {
        root: {
          boxShadow: theme.customShadows.z8,
          border: `solid 1px ${theme.palette.grey[500_12]}`,
          "& .MuiToggleButton-root": {
            border: "none",
            margin: 4,
            borderRadius: `${theme.shape.borderRadius}px !important`,
            "&.Mui-disabled": {
              border: "none",
            },
          },
        },
      },
    },
  };
};

export default ToggleButton;
