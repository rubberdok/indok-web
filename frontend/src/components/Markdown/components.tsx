import { Box, List, ListItemText, ListItem as MuiListItem, Typography } from "@mui/material";
import { listItemClasses } from "@mui/material/ListItem";
import { Components } from "react-markdown";

const Heading: Components["h1"] = ({ children, id, level }) => {
  const variant = `h${Math.max(level, 3)}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <Typography id={id} variant={variant} component={variant} gutterBottom>
      {children}
    </Typography>
  );
};

const Image: Components["img"] = (props) => {
  return (
    <Box maxWidth="100%" height="auto">
      <img {...props} style={{ objectFit: "contain" }} width="100%" />
    </Box>
  );
};

const UnorderedList: Components["ul"] = ({ children }) => {
  return (
    <List
      sx={{
        listStyleType: "disc",
        listStylePosition: "inside",
        [`& .${listItemClasses.root}`]: {
          display: "list-item",
        },
      }}
    >
      {children}
    </List>
  );
};

const OrderedList: Components["ol"] = ({ children }) => {
  return (
    <List
      sx={{
        listStyleType: "decimal",
        listStylePosition: "inside",
        [`& .${listItemClasses.root}`]: {
          display: "list-item",
        },
      }}
    >
      {children}
    </List>
  );
};

const ListItem: Components["li"] = ({ children }) => {
  return (
    <MuiListItem>
      <ListItemText primary={children} />
    </MuiListItem>
  );
};

export const h1 = Heading;
export const h2 = Heading;
export const h3 = Heading;
export const h4 = Heading;
export const h5 = Heading;
export const h6 = Heading;
export const img = Image;
export const ul = UnorderedList;
export const li = ListItem;
export const ol = OrderedList;

export const p: Components["p"] = ({ children }) => (
  <Typography variant="body1" paragraph>
    {children}
  </Typography>
);
