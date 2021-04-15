import { Typography } from "@material-ui/core";
import React, { ReactNode, ReactElement } from "react";
import { Variant } from "@material-ui/core/styles/createTypography";
import { Content } from "mdast";


type NodeToProps<T> = {
  node: T;
  children: T extends { children: any } ? ReactNode : never;
};

type CustomRenderers = {
  [K in Content["type"]]?: (
    props: NodeToProps<Extract<Content, { type: K }>>
  ) => ReactElement;
};

const renderers: CustomRenderers = {
  heading: ({ node, children }) => {
    const { depth } = node
    return <Typography variant={`h${depth}` as Variant}>{children}</Typography>
  },
  paragraph: ({ children }) => (
    <Typography variant="body2" component="p" paragraph>
      {children}
    </Typography>
  ),
};

export default renderers;
