import { CSSProperties } from "@emotion/serialize";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { HEADER_DESKTOP_HEIGHT, HEADER_MOBILE_HEIGHT } from "src/theme/constants";

type RootProps = {
  disableGutters?: boolean;
};

export const RootStyle = styled(Box, {
  shouldForwardProp: (prop) => prop !== "disableGutters",
})<RootProps>(({ theme, disableGutters }) => ({
  paddingTop: HEADER_MOBILE_HEIGHT,
  backgroundColor: theme.palette.background.neutral,
  color: theme.palette.text.primary,
  [theme.breakpoints.up("md")]: {
    paddingTop: HEADER_DESKTOP_HEIGHT,
  },
  marginBottom: disableGutters ? 0 : theme.spacing(4),
}));

export const ImageContainer = styled(Box)(({ theme }) => ({
  zIndex: -1,
  position: "absolute",
  overflow: "hidden",
  height: "100%",
  "& span": { height: "100% !important" },
  marginTop: `-${HEADER_MOBILE_HEIGHT}px`,
  [theme.breakpoints.up("md")]: {
    marginTop: `-${HEADER_DESKTOP_HEIGHT}px`,
  },
}));

export type OverlayProps = {
  opacity?: number;
  color?: CSSProperties["backgroundColor"];
};

export const ImageOverlay = styled(Box)<OverlayProps>(({ opacity, color }) => ({
  zIndex: 1,
  position: "absolute",
  height: "100%",
  width: "100%",
  backgroundColor: color ?? "black",
  opacity: opacity ?? 0.4,
}));