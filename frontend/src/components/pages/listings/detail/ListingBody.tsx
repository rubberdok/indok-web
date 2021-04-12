import { Card, CardContent, Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(4),
  },
}));

/**
 * component for the main body of a listing's detail
 * props: the listing to render
 */
const ListingBody: React.FC = (props) => {
  const classes = useStyles();

  return (
    <Grid item xs={10}>
      <Card className={classes.root}>
        <CardContent>
          {props.children}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ListingBody;
