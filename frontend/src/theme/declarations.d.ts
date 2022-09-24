import type {
  TypeBackground,
  ThemeOptions,
  Palette,
  PaletteOptions,
  CustomPalette,
  PaletteColorOptions,
} from "@mui/material/styles";
import type { TypographyPropsVariantOverrides } from "@mui/material/Typography";
import type { ButtonPropsColorOverrides } from "@mui/material/Button";

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
