import { Theme } from "@mui/material/styles";

const Tabs: any = (theme: Theme) => {
  return {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },

      styleOverrides: {
        root: {
          padding: 0,
          minWidth: 48,
          "&.Mui-selected": {
            color: theme.palette.text.primary,
          },
          "&:not(:last-of-type)": {
            marginRight: theme.spacing(3),
            "@media (min-width: 600px)": {
              marginRight: theme.spacing(5),
            },
          },
        },
        labelIcon: {
          minHeight: 48,
          flexDirection: "row",
          "& > *:first-of-type": {
            marginBottom: 0,
            marginRight: theme.spacing(1),
          },
        },
        wrapper: {
          flexDirection: "row",
          whiteSpace: "nowrap",
        },
        textColorInherit: {
          opacity: 1,
          color: theme.palette.text.secondary,
        },
      },
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiTabScrollButton: {
      styleOverrides: {
        root: {
          width: 48,
          borderRadius: "50%",
        },
      },
    },
  };
};

export default Tabs;
