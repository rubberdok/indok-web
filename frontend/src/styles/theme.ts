import { createTheme } from "@material-ui/core/styles";
import { Shadows } from "@material-ui/core/styles/shadows";
import breakpoints from "./breakpoints";
import typography from "./typography";

const theme = createTheme({
  typography: {
    ...typography,
  },
  overrides: {
    MuiTypography: {
      gutterBottom: {
        marginBottom: 32,
      },
      paragraph: {
        marginBottom: 32,
      },
    },
    MuiBreadcrumbs: {
      root: {
        ...typography.overline,
      },
    },
    MuiToolbar: {
      regular: {
        minHeight: "75px!important",
        padding: 0,
      },
    },
    MuiFab: {
      root: {
        justifyContent: "center",
      },
    },
    MuiButtonBase: {
      root: {
        justifyContent: "none",
      },
    },
    MuiButton: {
      root: {},
      text: {
        padding: "8px 24px",
      },
      contained: {
        padding: "8px 24px",
      },
      outlined: {
        padding: "8px 24px",
        border: "0",
        borderLeft: "2px solid rgb(0 0 0 / 10%)",
        fontSize: "0.8rem",
        color: "#000",
      },
      outlinedPrimary: {
        borderWidth: 2,
        color: "#000",
        background: "rgba(6, 90, 90, 0.07)",
        borderTop: "0",
        borderRight: "0",
        borderBottom: "0",

        ["&:hover"]: {
          borderTop: "0",
          borderRight: "0",
          borderBottom: "0",
          borderWidth: 2,
        },
      },
      sizeSmall: {
        fontSize: "0.8rem",
      },
      sizeLarge: {
        padding: "16px 24px",
        fontSize: "0.8rem",
      },
    },
    MuiTab: {
      root: {},
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
    ...breakpoints,
  },
  shadows: Array(25).fill("none") as Shadows,
});

export default theme;
