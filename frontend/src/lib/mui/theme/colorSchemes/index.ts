import { CssVarsThemeOptions } from "@mui/material";

import { dark } from "./dark";
import { janus } from "./janus";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { light } from "./light"; // Old palette. If we want it back all we need is to change the light palette to  from janus to light

export const colorSchemes: CssVarsThemeOptions["colorSchemes"] = {
  light: {
    palette: janus,
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
