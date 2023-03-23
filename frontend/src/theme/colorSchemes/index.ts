import { CssVarsThemeOptions } from "@mui/material";

import { dark } from "./dark";
import { light } from "./light";

export const colorSchemes: CssVarsThemeOptions["colorSchemes"] = {
  light: {
    palette: light,
  },
  dark: {
    palette: dark,
  },
};
