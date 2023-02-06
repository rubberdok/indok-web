import { PaletteMode, ThemeOptions } from "@mui/material";
import { grey } from "@mui/material/colors";

import { createShadow } from "./helpers";

export const shadows: (mode: PaletteMode) => ThemeOptions["shadows"] = (mode) => {
  switch (mode) {
    case "light":
      return createShadow(grey[400]);
    case "dark":
      return createShadow("#000");
    case "janus":
      return createShadow("#000");
  }
};
