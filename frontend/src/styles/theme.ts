import { createMuiTheme } from "@material-ui/core/styles";
import { Shadows } from "@material-ui/core/styles/shadows";
import typography from "./typography";

const theme = createMuiTheme({
  typography: {
    ...typography,
  },
  overrides: {
    MuiInputBase: {
      root: {
        ...typography.body2,
      },
    },
    MuiFormLabel: {
      root: {
        ...typography.body2,
      },
    },
    MuiTypography: {
      gutterBottom: {
        marginBottom: 32,
      },
      paragraph: {
        marginBottom: 32,
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
        padding: "16px 32px",
        fontWeight: 600,
        textTransform: "none",
      },
    },
    MuiButton: {
      root: {
        padding: "16px 32px",
        fontWeight: 600,
        fontSize: 14,
        textTransform: "none",
      },
      outlined: {
        padding: "16px 32px",
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
  props: {
    MuiTypography: {
      variant: "body2",
    },
    MuiList: {
      dense: true,
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
