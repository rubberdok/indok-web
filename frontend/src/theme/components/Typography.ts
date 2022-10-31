import { ThemeOptions } from "@mui/material";

export const Typography: ThemeOptions["components"] = {
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        body3: "p",
      },
    },
  },
};
