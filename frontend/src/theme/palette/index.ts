import { Color } from "@mui/material";
import { ThemeOptions } from "@mui/material/styles";

const palette = (mode: "light" | "dark"): ThemeOptions["palette"] => ({
  mode,
  ...(mode === "light" ? light : dark),
});

const grey: Partial<Color> = {
  50: "#F2F2F7",
  100: "#E5E5EA",
  200: "#D1D1D6",
  300: "#C7C7CC",
  400: "#8E8E93",
  500: "#636366",
  600: "#48484A",
  700: "#3A3A3C",
  800: "#2C2C2E",
  900: "#1C1C1E",
};

const light: ThemeOptions["palette"] = {
  primary: {
    main: "#2D6365",
    contrastText: "#fff",
  },
  secondary: {
    main: "#F37F31",
    contrastText: "#fff",
  },
  info: {
    main: "#00B1ED",
    contrastText: "#fff",
  },
  error: {
    main: "#FF3B30",
    contrastText: "#fff",
  },
  warning: {
    main: "#FF9500",
    contrastText: "#fff",
  },
  grey,
  success: {
    main: "#34C759",
    contrastText: "#fff",
  },
  contrast: {
    light: "#3A3A3C",
    dark: "#1C1C1E",
    main: "#2C2C2E",
    contrastText: "#fff",
  },
  background: {
    elevated: "#f0f0f0",
    default: "#fff",
    paper: "#fff",
  },
};

const dark: ThemeOptions["palette"] = {
  background: {
    elevated: "#1C1C1E",
    default: "#121212",
    paper: "#121212",
  },
  error: {
    main: "#FF4530",
    contrastText: "#fff",
  },
  warning: {
    main: "#FF9F0A",
    contrastText: "#fff",
  },
  grey,
  success: {
    main: "#30D158",
    contrastText: "#fff",
  },
  primary: {
    main: "#3E878A",
  },
  secondary: {
    main: "#F37F31",
  },
  contrast: {
    dark: "#E5E5EA",
    main: "#F2F2F7",
    light: "#fff",
    contrastText: "#000",
  },
};

export default palette;
