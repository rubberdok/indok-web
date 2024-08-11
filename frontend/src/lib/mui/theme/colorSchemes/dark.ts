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
    elevated: "#181D25",
    default: "#0f1217",
    paper: "#202731",
  },
  error: {
    main: "#FF4530",
    contrastText: "#fff",
  },
  warning: {
    main: "#F37F31",
    contrastText: "#fff",
  },
  grey,
  success: {
    main: "#30D158",
    contrastText: "#fff",
  },
  primary: {
    main: "#6a001a", //This has been changed from #3E878A to allow for janus change easily... Bad practice
  },
  secondary: {
    main: "#f5f5f5f5",
  },
  shadowChannel: colorChannel("#000"),
};
