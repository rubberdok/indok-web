import { Typography } from "@material-ui/core"
import React, { ElementType } from "react";
import { Variant } from "@material-ui/core/styles/createTypography";

const renderers: {[nodeType: string]: ElementType} = {
  heading: (props) => (<Typography variant={`h${props.level}` as Variant}>{props.children}</Typography>),
  paragraph: (props) => (<Typography variant="body2" component="p" paragraph>{props.children}</Typography>),
};

export default renderers;