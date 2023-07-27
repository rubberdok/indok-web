import type { Theme, CssVarsTheme } from "@mui/material/styles";

/**
 * By default, responsiveFontSizes will not work with CssVarsTheme. However, that is just a
 * Typescript issue. The actual implementation of responsiveFontSizes works fine with CssVarsTheme.
 * Therefore, we just augment the Typescript definition of responsiveFontSizes to work with
 * CssVarsTheme.
 */
declare module "@mui/material/styles" {
  function responsiveFontSizes(
    theme: Omit<Theme, "palette"> & CssVarsTheme,
    options?: ResponsiveFontSizesOptions
  ): Omit<Theme, "palette"> & CssVarsTheme;
}
