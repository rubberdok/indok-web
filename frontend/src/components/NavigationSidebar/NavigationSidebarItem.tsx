import { KeyboardArrowDown, ChevronRight } from "@mui/icons-material";
import { Box, Collapse, List, ListItemText } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { ListItemIconStyle, ListItemStyle, ListSubItemIconStyle } from "./styles";

import { NavigationItem } from ".";

type Props = {
  item: NavigationItem;
};

const NavigationSidebarItem: React.FC<Props> = ({ item }) => {
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
          {info}
          <Box ml={1}>{open ? <KeyboardArrowDown fontSize="small" /> : <ChevronRight fontSize="small" />}</Box>
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map(({ title: cTitle, path: cPath }) => {
              const isActiveSub = pathname === cPath || asPath === cPath;

              return (
                <NextLink key={cTitle} href={cPath} passHref>
                  <ListItemStyle activeSub={isActiveSub}>
                    <ListItemIconStyle>
                      <ListSubItemIconStyle component="span" active={isActiveSub} />
                    </ListItemIconStyle>
                    <ListItemText disableTypography primary={cTitle} />
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
        {info}
      </ListItemStyle>
    </NextLink>
  );
};

export default NavigationSidebarItem;
