import { Theme } from "@mui/material/styles";
import { ColorSchema } from "../../theme/palette";

type Props = (theme: Theme) => Theme["components"];

const Alert: Props = (theme) => {
  const lightMode = theme.palette.mode === "light";

  const standardStyle = (color: ColorSchema) => ({
    alignItems: "center",
    color: theme.palette[color][lightMode ? "darker" : "lighter"],
    backgroundColor: theme.palette[color][lightMode ? "lighter" : "darker"],
    "& .MuiAlert-icon": {
      color: theme.palette[color][lightMode ? "dark" : "light"],
    },
  });

  const filledStyle = (color: ColorSchema) => ({
    color: theme.palette[color].contrastText,
  });

  const outlinedStyle = (color: ColorSchema) => ({
    color: theme.palette[color][lightMode ? "darker" : "lighter"],
    border: `solid 1px ${theme.palette[color][lightMode ? "light" : "dark"]}`,
    backgroundColor: theme.palette[color][lightMode ? "lighter" : "darker"],
    "& .MuiAlert-icon": {
      color: theme.palette[color][lightMode ? "dark" : "light"],
    },
  });

  return {
    MuiAlert: {
      styleOverrides: {
        message: {
          "& .MuiAlertTitle-root": {
            marginBottom: theme.spacing(0.5),
          },
        },
        action: {
          "& button:not(:first-of-type)": {
            marginLeft: theme.spacing(1),
          },
        },
        icon: {
          "& svg": { width: 24, height: 24 },
        },

        standardInfo: standardStyle("info"),
        standardSuccess: standardStyle("success"),
        standardWarning: standardStyle("warning"),
        standardError: standardStyle("error"),

        filledInfo: filledStyle("info"),
        filledSuccess: filledStyle("success"),
        filledWarning: filledStyle("warning"),
        filledError: filledStyle("error"),

        outlinedInfo: outlinedStyle("info"),
        outlinedSuccess: outlinedStyle("success"),
        outlinedWarning: outlinedStyle("warning"),
        outlinedError: outlinedStyle("error"),
      },
    },
  };
};

export default Alert;
