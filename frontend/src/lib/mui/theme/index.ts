import { CssVarsThemeOptions } from "@mui/material";

// augments the Theme interface with CSS variables and color schemes
import type {} from "@mui/material/themeCssVarsAugmentation";

import { colorSchemes } from "./colorSchemes";
import { components } from "./components";
import { shadows } from "./shadows";
import { shape } from "./shape";
import { typography } from "./typography";

export function getCssVarsDesignTokens(): CssVarsThemeOptions {
  return {
    colorSchemes,
    shadows,
    typography,
    shape,
    components,
  };
}
