import { Color } from "@mui/material";
import { ColorFormat, ThemeOptions } from "@mui/material/styles";

const palette = (mode: "light" | "dark"): ThemeOptions["palette"] => ({
  mode,
  ...(mode === "light" ? light : {}),
});

const light: ThemeOptions["palette"] = {};

export default palette;
