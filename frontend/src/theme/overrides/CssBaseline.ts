import { Theme } from "@mui/material";

type Props = (theme: Theme) => any;

const CssBaseline: Props = (theme) => {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        },
        html: {
          width: "100%",
          height: "100%",
          WebkitOverflowScrolling: "touch",
        },
        body: {
          width: "100%",
          height: "100%",
        },
        "#__next": {
          width: "100%",
          height: "100%",
        }, // List
        "& ul, & ol": {
          paddingLeft: 24,
          "& li": {
            lineHeight: 2,
          },
        },
        a: {
          color: theme.palette.primary.main,
        },
      },
    },
  };
};

export default CssBaseline;
