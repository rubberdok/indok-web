import { Card, CardContent } from "@mui/material";

/** Wrapper component for the main body of a listing's detail. */
export const ListingBody: React.FC<React.PropsWithChildren<unknown>> = (props) => {
  return (
    <Card sx={{ marginBottom: (theme) => theme.spacing(4), padding: (theme) => theme.spacing(4) }}>
      <CardContent>{props.children}</CardContent>
    </Card>
  );
};
