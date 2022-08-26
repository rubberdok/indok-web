import { ThemeOptions } from "@mui/material";

const Dialog: ThemeOptions["components"] = {
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        boxShadow: theme.shadows[24],
        "&.MuiPaper-rounded": {
          borderRadius: Number(theme.shape.borderRadius) * 2,
        },
        "&.MuiDialog-paperFullScreen": {
          borderRadius: 0,
        },
        "&.MuiDialog-paper .MuiDialogActions-root": {
          padding: theme.spacing(3),
        },
        "@media (max-width: 600px)": {
          margin: theme.spacing(2),
        },
        "@media (max-width: 663.95px)": {
          "&.MuiDialog-paperWidthSm.MuiDialog-paperScrollBody": {
            maxWidth: "100%",
          },
        },
      }),
      paperFullWidth: {
        width: "100%",
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(3, 3, 0),
      }),
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderTop: 0,
        borderBottom: 0,
        padding: theme.spacing(3),
      }),
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: ({ theme }) => ({
        "& > :not(:first-of-type)": {
          marginLeft: theme.spacing(1.5),
        },
      }),
    },
  },
};

export default Dialog;
