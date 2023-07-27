import { AppBar as MuiAppBar, AppBarProps as MuiAppBarProps } from "@mui/material";
import { styled } from "@mui/material/styles";

import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "@/lib/mui/theme/constants";

interface AppBarProps extends MuiAppBarProps {
  scrolling?: boolean;
}

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "scrolling",
})<AppBarProps>(({ scrolling, theme }) => ({
  height: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up("md")]: {
    height: HEADER_DESKTOP_HEIGHT,
  },

  color: theme.vars.palette.text.primary,
  backgroundColor: theme.vars.palette.background.default,

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

  boxShadow: "none",

  filter: `drop-shadow(0px 15px 15px rgba(${theme.vars.palette.shadowChannel} / 0.00))`,
  [theme.getColorSchemeSelector("dark")]: {
    filter: `
      drop-shadow(0 4px 3px rgba(${theme.vars.palette.shadowChannel} / 0.00))
      drop-shadow(0 2px 2px rgba(${theme.vars.palette.shadowChannel} / 0.00))
    `,
  },

  /* When scrolling, show drop shadow and shrink the app bar on desktop */
  ...(scrolling && {
    filter: `drop-shadow(0px 15px 15px rgba(${theme.vars.palette.shadowChannel} / 0.08))`,
    [theme.getColorSchemeSelector("dark")]: {
      filter: `
      drop-shadow(0 4px 3px rgba(${theme.vars.palette.shadowChannel} / 0.07))
      drop-shadow(0 2px 2px rgba(${theme.vars.palette.shadowChannel} / 0.06))
    `,
    },
    [theme.breakpoints.up("md")]: {
      height: HEADER_DESKTOP_HEIGHT - 20,
    },
  }),
}));
