import {
  Box,
  Button,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemButtonProps,
  ListItemText,
  Stack,
} from "@mui/material";
import { alpha, styled, SxProps } from "@mui/material/styles";
import { generateFeideLoginUrl } from "@utils/auth";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { CaretDown, CaretUp, List as MenuIcon, User } from "phosphor-react";
import { useEffect, useState } from "react";
import { Logo } from "../../components";
import { DRAWER_WIDTH } from "../../theme/constants";
import { NavigationItemType } from "./NavigationConfig";

interface LinkStyleProps extends ListItemButtonProps {
  active?: boolean;
  theme?: any;
}

const LinkStyle = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active",
})<LinkStyleProps>(({ active, theme }) => ({
  ...theme.typography.body2,
  height: 48,
  textTransform: "capitalize",
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.text.secondary,
  ...(active && {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
  }),
}));

type NavigationMobileProps = {
  navigationConfig: NavigationItemType[];
  loggedIn: boolean;
  sx: SxProps;
};

const NavigationMobile: React.FC<NavigationMobileProps> = ({ navigationConfig, sx, loggedIn }) => {
  const { pathname } = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (drawerOpen) {
      handleDrawerClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const signInURL = generateFeideLoginUrl();

  return (
    <>
      <IconButton color="inherit" onClick={handleDrawerOpen} sx={sx}>
        <MenuIcon />
      </IconButton>

      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        anchor="right"
        PaperProps={{
          sx: { width: DRAWER_WIDTH },
        }}
      >
        <Box sx={{ px: 2.5, py: 3, lineHeight: 0 }}>
          <Logo />
        </Box>

        <List sx={{ px: 0 }}>
          {navigationConfig.map((link) => (
            <NavItemMobile key={link.title} item={link} />
          ))}
        </List>

        <Stack spacing={2} sx={{ p: 2.5, pb: 5 }}>
          {loggedIn ? (
            <NextLink href="/profile" passHref>
              <Button endIcon={<User />} variant="contained" color="inherit">
                Min side
              </Button>
            </NextLink>
          ) : (
            <Button variant="contained" href={signInURL} target="_blank" rel="noopener">
              Logg inn
            </Button>
          )}
        </Stack>
      </Drawer>
    </>
  );
};

type NavigationItemProps = {
  item: NavigationItemType & { children?: React.ReactElement };
};

const NavItemMobile: React.FC<NavigationItemProps> = ({ item }) => {
  const { pathname } = useRouter();

  const { title, path, children } = item;
  const rootPath = pathname.split("/")[1];
  const isActiveRoot = pathname === path;
  const isActiveRootWithChild = pathname.includes(`/${rootPath}/`);

  const [open, setOpen] = useState(isActiveRootWithChild);

  const handleOpen = () => {
    setOpen(!open);
  };

  if (children) {
    return (
      <>
        <LinkStyle onClick={handleOpen} active={isActiveRootWithChild}>
          <ListItemText disableTypography primary={title} />
          <Box ml={1}>{open ? <CaretDown width={16} height={16} /> : <CaretUp width={16} height={16} />}</Box>
        </LinkStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ display: "flex", flexDirection: "column-reverse" }}></Box>
        </Collapse>
      </>
    );
  }

  return (
    <NextLink key={title} href={path} passHref>
      <LinkStyle active={isActiveRoot}>
        <ListItemText disableTypography primary={title} />
      </LinkStyle>
    </NextLink>
  );
};

export default NavigationMobile;
