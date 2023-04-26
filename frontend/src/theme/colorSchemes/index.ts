import { CssVarsThemeOptions } from "@mui/material";

import { dark } from "./dark";
import { janus } from "./janus";
import { light } from "./light";

export const colorSchemes: CssVarsThemeOptions["colorSchemes"] = {
  light: {
    palette: light,
  },
  dark: {
    palette: dark,
  },
  janus: {
    palette: janus,
  },
};

declare module "@mui/material/styles" {
  interface ColorSchemeOverrides {
    janus: true;
  }
  interface TypeBackground {
    elevated: string;
  }
  interface CustomPalette {
    shadowChannel: string;
  }

  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}
