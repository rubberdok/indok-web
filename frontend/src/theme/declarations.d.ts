import type {} from "@mui/material/Button";
import type { Theme, CssVarsTheme } from "@mui/material/styles";
import type {} from "@mui/material/Typography";
import type {} from "@mui/material/themeCssVarsAugmentation";

declare module "@mui/material/styles" {
  interface TypeBackground {
    elevated: string;
  }

  interface TypographyVariants {
    subtitle3: React.CSSProperties;
    body3: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    subtitle3?: React.CSSProperties;
    body3?: React.CSSProperties;
  }

  function responsiveFontSizes(
    theme: Omit<Theme, "palette"> & CssVarsTheme,
    options?: ResponsiveFontSizesOptions
  ): Omit<Theme, "palette"> & CssVarsTheme;

  interface CustomPalette {
    contrast?: PaletteOptions["primary"];
    shadowChannel: string;
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    subtitle3: true;
    body3: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    contrast: true;
  }
}
