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
  transition: theme.transitions.create(["height", "background-color"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.short,
  }),
  [theme.breakpoints.up("md")]: {
    height: HEADER_DESKTOP_HEIGHT,
  },
  ...(transparent && {
    color: theme.palette.common.white,
    backgroundColor: "transparent",
  }),
  ...(scrolling && {
    boxShadow:
      theme.palette.mode === "light"
        ? `-23px 16px 56px -8px ${alpha(theme.palette.grey[600], 0.15)}`
        : `-23px 16px 56px -8px ${alpha(theme.palette.common.black, 0.25)}`,
    [theme.breakpoints.up("md")]: {
      height: HEADER_DESKTOP_HEIGHT - 20,
    },
  }),
}));
