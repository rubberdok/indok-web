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
  },
  secondary: {
    main: "#F37F31",
  },
  info: {
    main: "#00B1ED",
  },
  error: {
    main: "#FF3B30",
  },
  warning: {
    main: "#FF9500",
  },
  grey,
  success: {
    main: "#34C759",
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
  },
  warning: {
    main: "#FF9F0A",
  },
  grey,
  success: {
    main: "#30D158",
    contrastText: "#fff",
  },
  primary: {
    main: "#578283",
  },
  secondary: {
    main: "#F37F31",
  },
};

export default palette;
