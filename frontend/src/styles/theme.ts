import { createMuiTheme } from "@material-ui/core/styles";
import { Shadows } from "@material-ui/core/styles/shadows";
import breakpoints from "./breakpoints";
import typography from "./typography";

const theme = createMuiTheme({
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
        textTransform: "none",
        fontWeight: 600,
      },
    },
    MuiButton: {
      root: {
        textTransform: "none",
        fontWeight: 600,
      },
      text: {
        padding: "8px 24px",
      },
      contained: {
        padding: "8px 24px",
      },
      outlined: {
        padding: "8px 24px",
        border: "2px solid rgb(0 0 0 / 10%)",
      },
      outlinedPrimary: {
        borderWidth: 2,
        color: "black",
        background: "rgba(6, 90, 90, 0.07)",

        ["&:hover"]: {
          borderWidth: 2,
        },
      },
      sizeLarge: {
        padding: "16px 32px",
      },
    },
    MuiTab: {
      root: {
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
    ...breakpoints,
  },
  shadows: Array(25).fill("none") as Shadows,
});

export default theme;
