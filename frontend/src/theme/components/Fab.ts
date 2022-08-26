import { ComponentOverride } from "./types";

const Fab: ComponentOverride = (theme) => {
  const lightMode = theme.palette.mode === "light";

  return {
    MuiFab: {
      defaultProps: {
        color: "primary",
      },

      variants: [
        {
          props: { color: "default" },
          style: {
            color: lightMode ? theme.palette.common.white : theme.palette.grey[800],
            backgroundColor: theme.palette.text.primary,
            "&:hover": {
              backgroundColor: lightMode ? theme.palette.grey[700] : theme.palette.grey[400],
            },
          },
        },
        {
          props: { color: "inherit" },
          style: {
            backgroundColor: !lightMode ? theme.palette.grey[700] : undefined,
            "&:hover": {
              backgroundColor: lightMode ? theme.palette.grey[400] : theme.palette.grey[600],
            },
          },
        },
      ],

      styleOverrides: {
        root: {
          boxShadow: theme.customShadows.z8,
          "& svg": { width: 24, height: 24 },
          "&:hover": { boxShadow: "none" },
        },
        primary: {
          boxShadow: theme.customShadows.primary,
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
        },
        secondary: {
          boxShadow: theme.customShadows.secondary,
          "&:hover": {
            backgroundColor: theme.palette.secondary.dark,
          },
        },
        extended: {
          "& svg": {
            marginRight: theme.spacing(1),
          },
        },
      },
    },
  };
};

export default Fab;
