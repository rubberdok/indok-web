import { Typography } from "@material-ui/core";
import React, { ElementType, ReactNode } from "react";
import { Content } from "mdast";
import { Variant } from "@material-ui/core/styles/createTypography";

/*
import React, { ElementType, ReactElement, ReactNode } from "react";
import { Content } from "mdast";

The below type declarations will not work, likely due to
https://github.com/microsoft/TypeScript/issues/10530
More strict type checking could be achieved if the above issue is resolved.
*/
type NodeToProps<T> = {
  node: T;
  children: T extends { children: any } ? ReactNode : never;
};

/*
type CustomRenderers = {
  [K in Content["type"]]?: (
    props: NodeToProps<Extract<Content, { type: K }>>
  ) => ReactElement;
};
*/

const heading = ({ node, children }: NodeToProps<Extract<Content, { type: "heading" }>>) => {
  const { depth } = node;
  return <Typography variant={`h${depth}` as Variant}>{children}</Typography>;
};

const paragraph = ({ children }: NodeToProps<Extract<Content, { type: "paragraph" }>>) => (
  <Typography variant="body2" component="p" paragraph>
    {children}
  </Typography>
);

/**
 * @description Custom markdown renderers to override the default renderers of React-Markdown
 * @todo update to use the new components API with React-Markdown 6.0.0
 */
const renderers: { [nodeType: string]: ElementType } = {
  heading: heading,
  paragraph: paragraph,
};

export default renderers;
