import { TypeBackground } from "@mui/material/styles";
import { TypographyPropsVariantOverrides } from "@mui/material/Typography";

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
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    subtitle3: true;
    body3: true;
  }
}
