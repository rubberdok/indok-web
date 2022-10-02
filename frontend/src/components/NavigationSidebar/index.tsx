import { Box, BoxProps, List } from "@mui/material";

import NavigationSidebarItem from "./NavigationSidebarItem";
import { ListSubheaderStyle } from "./styles";

export type NavigationItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  info?: JSX.Element;
  children?: {
    title: string;
    path: string;
  }[];
};

type NavigationSidebarProps = BoxProps & {
  navConfig: {
    subheader: string;
    items: NavigationItem[];
  }[];
};

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

export default NavigationSidebar;
