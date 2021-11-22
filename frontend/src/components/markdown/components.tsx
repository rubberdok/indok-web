import { Typography } from "@mui/material";
import { Variant } from '@mui/material/styles';
import { HeadingComponent, NormalComponents } from "react-markdown/src/ast-to-react";

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
