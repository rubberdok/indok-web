import {
  Box,
  BoxProps,
  Collapse,
  List,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { CaretDown, CaretRight } from "phosphor-react";
import { useState } from "react";

const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)<{
  theme?: any;
}>(({ theme }) => ({
  ...theme.typography.overline,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(5),
  color: theme.palette.text.primary,
}));

interface ListItemStyleProps extends ListItemButtonProps {
  activeRoot?: boolean;
  activeSub?: boolean;
  theme?: any;
}

const ListItemStyle = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "activeRoot" && prop !== "activeSub",
})<ListItemStyleProps>(({ activeRoot, activeSub, theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: "relative",
  textTransform: "capitalize",
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

const ListItemIconStyle = styled(ListItemIcon)({
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

const ListSubItemIconStyle = styled(Box, {
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

type NavItemProps = {
  title: string;
  path: string;
  icon?: JSX.Element;
  info?: JSX.Element;
  children?: {
    title: string;
    path: string;
  }[];
};

interface NavigationSidebarProps extends BoxProps {
  navConfig: {
    subheader: string;
    items: NavItemProps[];
  }[];
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ navConfig, ...other }) => {
  return (
    <Box {...other}>
      {navConfig.map((list) => (
        <List key={list.subheader} disablePadding sx={{ px: 0 }}>
          <ListSubheaderStyle>{list.subheader}</ListSubheaderStyle>
          {list.items.map((item) => (
            <NavigationSidebarItem key={item.title} item={item} />
          ))}
        </List>
      ))}
    </Box>
  );
};

type NavigationSidebarItemProps = {
  item: NavItemProps;
};

function NavigationSidebarItem({ item }: NavigationSidebarItemProps) {
  const { pathname, asPath } = useRouter();

  const { title, path, icon, info, children } = item;
  const isActiveRoot = pathname === path || asPath === path;

  const [open, setOpen] = useState(isActiveRoot);

  const handleOpen = () => {
    setOpen(!open);
  };

  if (children) {
    return (
      <>
        <ListItemStyle onClick={handleOpen} activeRoot={isActiveRoot}>
          {icon && <ListItemIconStyle>{icon}</ListItemIconStyle>}
          <ListItemText disableTypography primary={title} />
          {info && info}
          <Box ml={1}>{open ? <CaretDown width={16} height={16} /> : <CaretRight width={16} height={16} />}</Box>
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((item) => {
              const { title, path } = item;
              const isActiveSub = pathname === path || asPath === path;

              return (
                <NextLink key={title} href={path} passHref>
                  <ListItemStyle activeSub={isActiveSub}>
                    <ListItemIconStyle>
                      <ListSubItemIconStyle component="span" active={isActiveSub} />
                    </ListItemIconStyle>
                    <ListItemText disableTypography primary={title} />
                  </ListItemStyle>
                </NextLink>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <NextLink href={path} passHref>
      <ListItemStyle activeRoot={isActiveRoot}>
        {icon && <ListItemIconStyle>{icon}</ListItemIconStyle>}
        <ListItemText disableTypography primary={title} />
        {info && info}
      </ListItemStyle>
    </NextLink>
  );
}

export default NavigationSidebar;
