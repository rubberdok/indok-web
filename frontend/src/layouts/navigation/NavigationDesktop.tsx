import { Box, Link, LinkProps, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { CaretDown, CaretUp } from "phosphor-react";
import { useEffect, useState } from "react";
import { NavigationItemType } from "./NavigationConfig";

interface LinkStyleProps extends LinkProps {
  open?: boolean;
  active?: boolean;
  scrolling?: boolean;
  transparent?: boolean;
  theme?: any;
}

const LinkStyle = styled(Link, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "scrolling" && prop !== "transparent" && prop !== "open",
})<LinkStyleProps>(({ open, active, scrolling, transparent, theme }) => {
  const dotActiveStyle = {
    "&:before": {
      top: 0,
      width: 6,
      height: 6,
      bottom: 0,
      left: -14,
      content: '""',
      display: "block",
      margin: "auto 0",
      borderRadius: "50%",
      position: "absolute",
      backgroundColor: theme.palette.primary.main,
    },
  };
  return {
    ...theme.typography.subtitle2,
    fontWeight: theme.typography.fontWeightMedium,
    display: "flex",
    color: "inherit",
    position: "relative",
    alignItems: "center",
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shortest,
    }),
    "&:hover": {
      opacity: 0.72,
      textDecoration: "none",
    },
    ...(active && {
      ...dotActiveStyle,
      color: theme.palette.text.primary,
      ...(transparent && { color: theme.palette.common.white }),
      ...(scrolling && { color: theme.palette.text.primary }),
    }),
    ...(open && {
      color: theme.palette.primary.main,
    }),
  };
});

type NavigationDesktopProps = {
  isScrolling?: boolean;
  isTransparent?: boolean;
  navigationConfig: NavigationItemType[];
  loggedIn: boolean;
};

const NavigationDesktop: React.FC<NavigationDesktopProps> = ({
  isScrolling,
  isTransparent,
  navigationConfig,
  loggedIn,
}) => {
  return (
    <Stack
      direction="row"
      spacing={6}
      sx={{
        ml: 6,
        color: "text.secondary",
        ...(isTransparent && {
          color: "inherit",
        }),
        ...(isScrolling && {
          color: "text.secondary",
        }),
      }}
    >
      {navigationConfig.map(
        (link) =>
          !(!loggedIn && link.title === "Arkiv") && (
            <NavigationItemDesktop
              key={link.title}
              item={link}
              isScrolling={isScrolling}
              isTransparent={isTransparent}
            />
          )
      )}
    </Stack>
  );
};

type NavigationItemProps = {
  isScrolling?: boolean;
  isTransparent?: boolean;
  item: NavigationItemType & { children?: React.ReactElement };
};

const NavigationItemDesktop: React.FC<NavigationItemProps> = ({ item, isScrolling, isTransparent }) => {
  const { title, path, children } = item;

  const { pathname, asPath } = useRouter();

  const [open, setOpen] = useState(false);

  const isActiveRoot = path === pathname || (path !== "/" && asPath.includes(path));

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (children) {
    return (
      <>
        <LinkStyle onClick={handleOpen} open={open} scrolling={isScrolling} transparent={isTransparent}>
          {title}
          <Box ml={0.5}>{open ? <CaretDown width={16} height={16} /> : <CaretUp width={16} height={16} />}</Box>
        </LinkStyle>
      </>
    );
  }

  return (
    <NextLink key={title} href={path} passHref>
      <LinkStyle active={isActiveRoot} scrolling={isScrolling} transparent={isTransparent}>
        {title}
      </LinkStyle>
    </NextLink>
  );
};

export default NavigationDesktop;
