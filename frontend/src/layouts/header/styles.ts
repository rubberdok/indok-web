import { Toolbar, ToolbarProps } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "../../theme/constants";

interface ToolbarStyleProps extends ToolbarProps {
  transparent?: boolean;
  scrolling?: boolean;
}

export const ToolbarStyle = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== "transparent" && prop !== "scrolling",
})<ToolbarStyleProps>(({ transparent, scrolling, theme }) => ({
  height: HEADER_MOBILE_HEIGHT,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,
  transition: `${theme.transitions.create(["height", "background-color", "filter"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.shorter,
  })}, ${theme.transitions.create(["filter"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  })}`,
  willChange: "filter",
  [theme.breakpoints.up("md")]: {
    height: HEADER_DESKTOP_HEIGHT,
  },
  ...(transparent && {
    color: theme.palette.common.white,
    backgroundColor: "transparent",
  }),
  filter:
    theme.palette.mode === "light"
      ? `drop-shadow(0 25px 25px ${alpha(theme.palette.common.black, 0)})`
      : `drop-shadow(0 4px 3px ${alpha(theme.palette.common.black, 0)}) drop-shadow(0 2px 2px ${alpha(
          theme.palette.common.black,
          0
        )})`,
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
