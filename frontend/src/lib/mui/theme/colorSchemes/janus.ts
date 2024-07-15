import { ColorSystemOptions, createTheme } from "@mui/material/styles";
import { colorChannel } from "@mui/system/colorManipulator";
import deepmerge from "deepmerge";

import { light } from "./light";

const janusPaletteBase = createTheme({ palette: light }).palette;

export const janus: ColorSystemOptions["palette"] = deepmerge(janusPaletteBase, {
  primary: {
    main: "#800020",
  },
  info: {
    main: "#00B1ED",
  },
  error: {
    main: "#FF3B30",
  },
  background: {
    elevated: "#F1EDE4",
    default: "#FAF9F6",
    paper: "#FAF9F6",
  },
  shadowChannel: colorChannel("#000000"),
});
