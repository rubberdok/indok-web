"use client";
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
import { isValidElement } from "react";
import { Components } from "react-markdown";

import { Link } from "@/app/components/Link";

const H1: Components["h1"] = ({ children, id }) => {
  return (
    <Typography id={id} variant="h3" component="h2" gutterBottom>
      {children}
    </Typography>
  );
};

const H2: Components["h2"] = ({ children, id }) => {
  return (
    <Typography id={id} variant="h4" component="h3" gutterBottom>
      {children}
    </Typography>
  );
};

const H3: Components["h2"] = ({ children, id }) => {
  return (
    <Typography id={id} variant="h5" component="h4" gutterBottom>
      {children}
    </Typography>
  );
};

const H4: Components["h2"] = ({ children, id }) => {
  return (
    <Typography id={id} variant="h6" component="h5" gutterBottom>
      {children}
    </Typography>
  );
};

const H5: Components["h2"] = ({ children, id }) => {
  return (
    <Typography id={id} variant="subtitle1" component="h6" gutterBottom>
      {children}
    </Typography>
  );
};

const H6: Components["h2"] = ({ children, id }) => {
  return (
    <Typography id={id} variant="subtitle2" component="span" gutterBottom>
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

export const h1 = H1;
export const h2 = H2;
export const h3 = H3;
export const h4 = H4;
export const h5 = H5;
export const h6 = H6;
export const img = Image;
export const ul = UnorderedList;
export const li = ListItem;
export const ol = OrderedList;
export const a = Anchor;
export const code = CodeBlock;
export const blockquote = BlockquoteComponent;
export const hr = Hr;

export const p: Components["p"] = ({ children }) => {
  // Avoid wrapping images in paragraphs tags
  if (children && children[0]) {
    const child = children[0];
    if (isValidElement(child)) {
      console.log({ child });
      if ("src" in child.props)
        return (
          <Typography variant="body1" component="span">
            {children}
          </Typography>
        );
    }
  }
  return (
    <Typography variant="body1" paragraph>
      {children}
    </Typography>
  );
};
