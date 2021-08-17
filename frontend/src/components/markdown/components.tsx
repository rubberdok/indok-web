import { Typography } from "@material-ui/core";
import { HeadingComponent, NormalComponents } from "react-markdown/src/ast-to-react";

const Heading: HeadingComponent = ({ children, id, level }) => {
  const variant = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <Typography id={id} variant={variant} component={variant} gutterBottom>
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
