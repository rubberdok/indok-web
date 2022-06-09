import { Typography } from "@mui/material";
import { Components } from "react-markdown";

const Heading: Components["h1"] = ({ children, id, level }) => {
  const variant = `h${Math.max(level, 3)}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
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
export const p: Components["p"] = ({ children }) => (
  <Typography variant="body1" paragraph>
    {children}
  </Typography>
);
