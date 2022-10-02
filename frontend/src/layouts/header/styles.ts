import { AppBar as MuiAppBar, AppBarProps as MuiAppBarProps } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

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

  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,

  ...(transparent && {
    color: theme.palette.common.white,
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
  filter:
    theme.palette.mode === "light"
      ? `drop-shadow(0 25px 25px ${alpha(theme.palette.common.black, 0)})`
      : `drop-shadow(0 4px 3px ${alpha(theme.palette.common.black, 0)}) drop-shadow(0 2px 2px ${alpha(
          theme.palette.common.black,
          0
        )})`,

  /* When scrolling, show drop shadow and shrink the app bar on desktop */
  ...(scrolling && {
    filter:
      theme.palette.mode === "light"
        ? `drop-shadow(0 25px 25px ${alpha(theme.palette.common.black, 0.06)})`
        : `drop-shadow(0 4px 3px ${alpha(theme.palette.common.black, 0.07)}) drop-shadow(0 2px 2px ${alpha(
            theme.palette.common.black,
            0.06
          )})`,
    [theme.breakpoints.up("md")]: {
      height: HEADER_DESKTOP_HEIGHT - 20,
    },
  }),
}));
