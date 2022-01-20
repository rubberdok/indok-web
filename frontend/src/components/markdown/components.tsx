import { Typography } from "@material-ui/core";
import { Variant } from "@material-ui/core/styles/createTypography";
import { HeadingComponent } from "react-markdown/lib/ast-to-react";
import { NormalComponents } from "react-markdown/lib/complex-types";

const Heading: HeadingComponent = ({ children, id, level }) => {
  const variant = `h${level}` as Variant;
  return (
    <Typography id={id} variant={variant} gutterBottom>
      {children}
    </Typography>
  );
};

export const h1 = Heading;
export const h2 = Heading;
export const h3 = Heading;
export const h4 = Heading;
export const h5 = Heading;
export const h6 = Heading;
export const p: NormalComponents["p"] = ({ children }) => (
  <Typography variant="body2" paragraph>
    {children}
  </Typography>
);
