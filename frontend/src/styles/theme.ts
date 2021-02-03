import { createMuiTheme } from "@material-ui/core/styles";
import { Shadows } from "@material-ui/core/styles/shadows";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
    h1: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontSize: "4rem",
      fontWeight: 800,
    },
    h2: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontSize: "3rem",
      fontWeight: 800,
      lineHeight: "3.5rem",
    },
    h3: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontSize: "2.5rem",
      fontWeight: 800,
    },
    h4: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontWeight: 700,
      fontSize: "2rem",
    },
    h5: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontWeight: 700,
      fontSize: "1.5rem",
    },
    h6: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontWeight: 800,
      fontSize: "1.25rem",
    },
    overline: {
      fontSize: "12px",
      letterSpacing: "0.5px",
    },
    body1: {
      fontFamily: ["Source Serif Pro", "sans-serif"].join(","),
      fontSize: "1.1rem",
      fontWeight: 500,
      lineHeight: "1.6rem",
    },
    body2: {
      fontFamily: ["Source Serif Pro", "sans-serif"].join(","),
      fontSize: "0.9rem",
      fontWeight: 500,
      lineHeight: "1.3rem",
    },
  },
  overrides: {
    MuiButton: {
      root: {
        padding: "16px 32px",
        fontWeight: 700,
        fontSize: 11,
      },
    },
    MuiAppBar: {
      root: {
        fontFamily: ["Montserrat", "sans-serif"].join(","),
      },
      colorDefault: {
        backgroundColor: "#ffffff",
      },
    },
    MuiTabs: {
      root: {
        minHeight: 40,
      },
    },
    MuiTab: {
      root: {
        padding: "24px 16px",
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
