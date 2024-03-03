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

export const light: PaletteOptions = {
  primary: {
    main: "#6a001a", //This has been changed from #2D6365 to allow for janus change easily... Bad practice
    contrastText: "#fff",
  },
  secondary: {
    main: "#2C2C2E",
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
    main: "#F37F31",
    contrastText: "#fff",
  },
  grey,
  success: {
    main: "#34C759",
    contrastText: "#fff",
  },
  background: {
    elevated: "#f5f5f7",
    default: "#fff",
    paper: "#fff",
  },
  shadowChannel: colorChannel("#161C24"),
};
