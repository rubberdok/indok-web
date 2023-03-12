import { Color, PaletteOptions } from "@mui/material";
import { colorChannel } from "@mui/system/colorManipulator";

const grey: Partial<Color> = {
  50: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
};

export const dark: PaletteOptions = {
  background: {
    elevated: grey[900],
    default: "#0f1217",
    paper: grey[800],
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
    mainChannel: colorChannel("#F2F2F7"),
    darkChannel: colorChannel("#E5E5EA"),
    lightChannel: colorChannel("#fff"),
    contrastTextChannel: colorChannel("#000"),
  },
  shadowChannel: colorChannel("#000"),
};
