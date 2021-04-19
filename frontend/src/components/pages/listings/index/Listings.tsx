import ListingItem from "@components/pages/listings/index/ListingItem";
import { LISTINGS } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import { useQuery } from "@apollo/client";
import { Grid, Typography, makeStyles, CircularProgress, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

/**
 * component to show an overview of all open listings
 * props:
 * - handleClick function to reload the page on an error
 */
const Listings: React.FC<{
  handleClick: () => void;
}> = ({ handleClick }) => {
  // fetches all open listings
  const { loading, error, data } = useQuery<{ listings: Listing[] }>(LISTINGS);

  const classes = useStyles();

  // if the data is fetched, renders a ListingItem for each listing
  return (
    <Grid container direction="row" spacing={2} className={classes.root} justify="center" alignItems="stretch">
      {loading && (
        <Grid item>
          <CircularProgress color="primary" />
        </Grid>
      )}
      {error && (
        <Grid container item direction="column" alignItems="center">
          <Grid item>
            <Typography variant="body1" align="center">
              Noe gikk galt da vi forsøkte å laste inn vervene.
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" align="center">
              Skjer dette ofte? Ta kontakt på med <a href="mailto:web@indokhs.no">Indøks Webkomité</a>
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleClick}>
              Prøv på nytt
            </Button>
          </Grid>
        </Grid>
      )}
      {data &&
        data.listings.map((listing) => (
          <Grid container item key={listing.id} md={5} sm={7} xs={10}>
            <ListingItem listing={listing} />
          </Grid>
        ))}
    </Grid>
  );
};

export default Listings;
