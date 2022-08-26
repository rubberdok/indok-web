import { ThemeOptions } from "@mui/material/styles";

const palette = (mode: "light" | "dark"): ThemeOptions["palette"] => ({
  mode,
  ...(mode === "light" ? light : dark),
});

const light: ThemeOptions["palette"] = {
  background: {
    neutral: "#f0f0f0",
    default: "#fff",
    paper: "#fff",
  },
};
const dark: ThemeOptions["palette"] = {};

export default palette;
