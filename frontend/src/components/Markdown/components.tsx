import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItemText,
  ListItem as MuiListItem,
  Typography,
} from "@mui/material";
import { listItemClasses } from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";
import { typographyClasses } from "@mui/material/Typography";
import { Components } from "react-markdown";

import Link from "../Link";

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

const Anchor: Components["a"] = ({ children, href }) => {
  return <Link href={href ?? ""}>{children}</Link>;
};

const Code = styled("code")({});

const CodeBlock: Components["code"] = ({ children, inline }) => {
  if (inline)
    return (
      <Code
        sx={{ bgcolor: "background.elevated", px: 1, py: 0.5, borderRadius: (theme) => theme.shape.borderRadius / 2 }}
      >
        {children}
      </Code>
    );
  return (
    <Card
      sx={{ display: inline ? "inline" : "block", bgcolor: "background.elevated", overflowX: "scroll" }}
      elevation={0}
    >
      <CardContent>
        <code>{children}</code>
      </CardContent>
    </Card>
  );
};

const Blockquote = styled("blockquote")({});

const BlockquoteComponent: Components["blockquote"] = ({ children }) => {
  return (
    <div>
      <Typography component="span" color="text.secondary">
        <Blockquote
          sx={(theme) => ({
            borderLeft: `4px solid ${theme.vars.palette.divider}`,
            pl: 2,
            ml: 2,
            [`& .${typographyClasses.root}`]: { marginBottom: 0 },
          })}
        >
          {children}
        </Blockquote>
      </Typography>
    </div>
  );
};

const Hr: Components["hr"] = () => <Divider variant="fullWidth" />;

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
export const a = Anchor;
export const code = CodeBlock;
export const blockquote = BlockquoteComponent;
export const hr = Hr;

export const p: Components["p"] = ({ children }) => (
  <Typography variant="body1" paragraph>
    {children}
  </Typography>
);
