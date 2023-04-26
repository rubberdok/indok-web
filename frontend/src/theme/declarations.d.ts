import type {} from "@mui/material/Button";
import type { Theme, CssVarsTheme } from "@mui/material/styles";
import type {} from "@mui/material/Typography";
import type {} from "@mui/material/themeCssVarsAugmentation";

declare module "@mui/material/styles" {
  interface TypeBackground {
    elevated: string;
  }

  function responsiveFontSizes(
    theme: Omit<Theme, "palette"> & CssVarsTheme,
    options?: ResponsiveFontSizesOptions
  ): Omit<Theme, "palette"> & CssVarsTheme;

  interface CustomPalette {
    shadowChannel: string;
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    contrast: true;
  }
}
