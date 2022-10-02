import type { ButtonPropsColorOverrides } from "@mui/material/Button";
import type {
  TypeBackground,
  ThemeOptions,
  Palette,
  PaletteOptions,
  CustomPalette,
  PaletteColorOptions,
} from "@mui/material/styles";
import type { TypographyPropsVariantOverrides } from "@mui/material/Typography";

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

  interface CustomPalette {
    contrast?: PaletteOptions["primary"];
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
