import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
    h1: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontSize: "48px",
      fontWeight: 900,
    },
    h3: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontSize: "30px",
      fontWeight: 900,
    },
    h6: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontWeight: 900,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        padding: "16px 32px",
        textTransform: "none",
      },
    },
  },
  palette: {
    background: {
      default: "#f2efea",
    },
    primary: {
      main: "#065A5A",
    },
    secondary: {
      main: "#11cb5f",
    },
  },
  shape: {
    borderRadius: 0,
  },
  shadows: [
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
  ],
});

export default theme;
