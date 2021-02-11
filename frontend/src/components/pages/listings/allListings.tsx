import { useQuery } from "@apollo/client";
import { Listing } from "@interfaces/listings";
import { LISTINGS } from "@graphql/listings/queries";
import Link from "next/link";
import {
  Typography,
  Grid,
  makeStyles,
  Container,
  Card,
  CardContent,
  Hidden,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@material-ui/core"

import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import ListingItem from "./listingItem";
import Filter from "./filter";

const useStyles = makeStyles((theme) => ({

title: {
  paddingBottom: theme.spacing(4),
  paddingTop: theme.spacing(8),
},

container: {
  flexDirection: "row",
  justifyContent: "center"
},

filter: {
  width: "100%",
}
}));

//TODO: remove userID once user log-in is properly implemented
const AllListings: React.FC = () => {
  const { loading, error, data } = useQuery<{ listings: Listing[] }>(LISTINGS);
  const classes = useStyles();

  // TODO: remove example organizations
  const filters = ["Bindeleddet", "Janus", "Estiem", "Hovedstyret", "Janus FK", "Indøl"]
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <>
      <Container>
        <Typography variant="h1" style={{ textAlign: "center" }} className={classes.title}>
          Åpne verv på Indøk
        </Typography>

        <Grid container className={classes.container} spacing={2} wrap>
          <Filter filters={filters} />
          
          <Grid item xs={8}>
            <Grid container spacing={2} className={classes.applications}>
              {data && (
                data.listings.map((listing) => (
                  <Grid item xs>
                    <ListingItem listing={listing} />
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>
        </Grid>

      </Container>
    </>
    
   
  );
};

export default AllListings;
