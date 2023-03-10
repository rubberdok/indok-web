import { CssVarsThemeOptions } from "@mui/material";

import { light, dark } from "../palette";

export const colorSchemes: CssVarsThemeOptions["colorSchemes"] = {
  light: {
    palette: light,
  },
  dark: {
    palette: dark,
  },
};
