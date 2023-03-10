import { AppBar as MuiAppBar, AppBarProps as MuiAppBarProps } from "@mui/material";
import { styled } from "@mui/material/styles";

import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "../../theme/constants";

interface AppBarProps extends MuiAppBarProps {
  transparent?: boolean;
  scrolling?: boolean;
}

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "transparent" && prop !== "scrolling",
})<AppBarProps>(({ transparent, scrolling, theme }) => ({
  height: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up("md")]: {
    height: HEADER_DESKTOP_HEIGHT,
  },

  color: theme.vars.palette.text.primary,
  backgroundColor: theme.vars.palette.background.default,

  ...(transparent && {
    color: theme.vars.palette.common.white,
    backgroundColor: "transparent",
  }),

  /* Transition drop shadow and height smoothly */
  transition: `${theme.transitions.create(["height", "background-color"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.short,
  })}, ${theme.transitions.create(["filter"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  })}`,

  /* Browser optimization for smooth animations */
  willChange: "filter",

  /* Replace default box shadow with our own */
  boxShadow: "none",
  /* Drop shadow, hidden when not scrolling to avoid flicker when scrolling starts */

  ...(scrolling
    ? {
        [theme.getColorSchemeSelector("light")]: {
          filter: `drop-shadow(0 25px 25px rgba(${theme.vars.palette.shadowChannel} / 0.06)`,
        },

        [theme.getColorSchemeSelector("dark")]: {
          filter: `
        drop-shadow(0 4px 3px rgba(${theme.vars.palette.shadowChannel} / 0.07))
        drop-shadow(0 2px 2px rgba(${theme.vars.palette.shadowChannel} / 0.06))
      `,
        },

        [theme.breakpoints.up("md")]: {
          height: HEADER_DESKTOP_HEIGHT - 20,
        },
      }
    : {
        [theme.getColorSchemeSelector("light")]: {
          filter: `drop-shadow(0 25px 25px rgba(${theme.vars.palette.shadowChannel} / 0))`,
        },

        [theme.getColorSchemeSelector("dark")]: {
          filter: `
        drop-shadow(0 4px 3px rgba(${theme.vars.palette.shadowChannel} / 0))
        drop-shadow(0 2px 2px rgba(${theme.vars.palette.shadowChannel} / 0))
      `,
        },
      }),
}));
