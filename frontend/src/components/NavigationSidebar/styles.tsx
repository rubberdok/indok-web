import {
  Box,
  BoxProps,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListSubheader,
  ListSubheaderProps,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

export const ListSubheaderStyle: React.FC<ListSubheaderProps> = styled((props) => (
  <ListSubheader disableSticky disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.overline,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(5),
  color: theme.palette.text.primary,
}));

type ListItemStyleProps = ListItemButtonProps & {
  activeRoot?: boolean;
  activeSub?: boolean;
  theme?: any;
};

export const ListItemStyle = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "activeRoot" && prop !== "activeSub",
})<ListItemStyleProps>(({ activeRoot, activeSub, theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: "relative",
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.text.secondary,
  ...(activeRoot && {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    "&:before": {
      top: 0,
      right: 0,
      width: 3,
      bottom: 0,
      content: "''",
      display: "block",
      position: "absolute",
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
      backgroundColor: theme.palette.primary.main,
    },
  }),
  ...(activeSub && {
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
  }),
}));

export const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& svg": {
    width: 22,
    height: 22,
  },
});

interface ListSubItemIconStyleProps extends BoxProps {
  active?: boolean;
}

export const ListSubItemIconStyle = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active",
})<ListSubItemIconStyleProps>(({ active, theme }) => ({
  width: 4,
  height: 4,
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.text.disabled,
  transition: theme.transitions.create("transform"),
  ...(active && {
    transform: "scale(2)",
    backgroundColor: theme.palette.primary.main,
  }),
}));
