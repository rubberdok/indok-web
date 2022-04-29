import { Card, CardContent } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(4),
  },
}));

/**
 * Wrapper component for the main body of a listing's detail.
 */
const ListingBody: React.FC = (props) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>{props.children}</CardContent>
    </Card>
  );
};

export default ListingBody;
