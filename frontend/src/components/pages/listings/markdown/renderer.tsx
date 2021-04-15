import { Typography } from "@material-ui/core";
import React, { ElementType } from "react";
import { Variant } from "@material-ui/core/styles/createTypography";

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
