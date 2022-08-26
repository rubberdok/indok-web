import { PaletteMode } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ThemeOptions } from "@mui/material/styles";
import { createShadow } from "./helpers";

const shadows: (mode: PaletteMode) => ThemeOptions["shadows"] = (mode) => {
  switch (mode) {
    case "light":
      return createShadow(grey[500]);
    case "dark":
      return createShadow("#000");
  }
};

export default shadows;
