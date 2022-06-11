import { ComponentOverride } from "./types";
import { ColorSchema } from "../palette";

const ButtonGroup: ComponentOverride = (theme) => {
  const styleContained = (color: ColorSchema) =>
    ({
      props: { variant: "contained", color },
      style: { boxShadow: theme.customShadows[color] },
    } as const);

  return {
    MuiButtonGroup: {
      variants: [
        {
          props: { variant: "contained", color: "inherit" },
          style: { boxShadow: theme.customShadows.z8 },
        },
        styleContained("primary"),
        styleContained("secondary"),
        styleContained("info"),
        styleContained("success"),
        styleContained("warning"),
        styleContained("error"),

        {
          props: { disabled: true },
          style: {
            boxShadow: "none",
            "& .MuiButtonGroup-grouped.Mui-disabled": {
              color: theme.palette.action.disabled,
              borderColor: `${theme.palette.action.disabledBackground} !important`,
              "&.MuiButton-contained": {
                backgroundColor: theme.palette.action.disabledBackground,
              },
            },
          },
        },
      ],

      styleOverrides: {
        root: {
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
  };
};

export default ButtonGroup;
