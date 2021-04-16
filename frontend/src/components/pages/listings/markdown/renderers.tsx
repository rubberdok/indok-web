import { Typography } from "@material-ui/core";
import React, { ElementType, ReactElement, ReactNode } from "react";
import { Variant } from "@material-ui/core/styles/createTypography";

/*
import React, { ElementType, ReactElement, ReactNode } from "react";
import { Content } from "mdast";

The below type declarations will not work, likely due to
https://github.com/microsoft/TypeScript/issues/10530
More strict type checking could be achieved if the above issue is resolved.

type NodeToProps<T> = {
  node: T;
  children: T extends { children: any } ? ReactNode : never;
};

type CustomRenderers = {
  [K in Content["type"]]?: (
    props: NodeToProps<Extract<Content, { type: K }>>
  ) => ReactElement;
};
*/

const heading = (props: any) => <Typography variant={`h${props.level}` as Variant}>{props.children}</Typography>;

 const paragraph = (props: any) => (
   <Typography variant="body2" component="p" paragraph>
     {props.children}
   </Typography>
 );

 const renderers: { [nodeType: string]: ElementType } = {
   heading: heading,
   paragraph: paragraph,
 };

export default renderers;
