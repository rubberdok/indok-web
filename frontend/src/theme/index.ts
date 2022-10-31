import { PaletteMode, ThemeOptions } from "@mui/material";

import { components } from "./components";
import { palette } from "./palette";
import { shadows } from "./shadows";
import { shape } from "./shape";
import { typography } from "./typography";

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: palette(mode),
  shadows: shadows(mode),
  typography,
  shape,
  components,
});
