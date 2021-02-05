import { createMuiTheme } from "@material-ui/core/styles";
import { Shadows } from "@material-ui/core/styles/shadows";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
    h1: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontSize: "50px",
      fontWeight: 800,
    },
    h2: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontSize: "48px",
      fontWeight: 800,
    },
    h3: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontSize: "48px",
      fontWeight: 500,
    },
    h4: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontWeight: 700,
      fontSize: "28px",
    },
    h5: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontWeight: 700,
      fontSize: "24px",
    },
    h6: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontWeight: 800,
    },
    overline: {
      fontSize: "13px",
      letterSpacing: "0.05em",
      fontWeight: 600,
      color: "#b0aca5",
    },
    body2: {
      fontSize: "15px",
      fontWeight: 500,
      lineHeight: "24px",
    },
  },
  overrides: {
    MuiButtonBase: {
      root: {
        padding: "16px 32px",
        fontSize: 11,
        fontWeight: 600,
        textTransform: "none",
      },
    },
    MuiButton: {
      root: {
        padding: "16px 32px",
        fontWeight: 600,
        fontSize: 11,
        textTransform: "none",
      },
    },
  },
  palette: {
    background: {
      default: "#f2efea",
    },
    primary: {
      main: "#0b3c3c",
    },
    secondary: {
      main: "#11cb5f",
    },
  },
  shape: {
    borderRadius: 0,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1300,
      xl: 1920,
    },
  },
  shadows: Array(25).fill("none") as Shadows,
});

export default theme;
