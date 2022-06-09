import { useQuery } from "@apollo/client";
import ListingItem from "@components/pages/listings/index/ListingItem";
import { LISTINGS } from "@graphql/listings/queries";
import { Listing } from "@interfaces/listings";
import { Button, CircularProgress, Grid, Typography, Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import EmptyStreet from "public/illustrations/EmptyStreet.svg";

/**
 * Component to show an overview of all open listings.
 *
 * Props:
 * - reload function to reload the page on an error
 */
const Listings: React.FC<{
  reload: () => void;
}> = ({ reload }) => {
  // fetches all open listings
  const { loading, error, data } = useQuery<{ listings: Listing[] }>(LISTINGS);

  // if the data is fetched, renders a ListingItem for each listing
  return (
    <Grid container direction="row" spacing={2} justifyContent="center" alignItems="stretch">
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
              Skjer dette ofte? Send en mail til <Link href="mailto:contact@rubberdok.no">contact@rubberdok.no</Link>.
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={reload}>
              Prøv på nytt
            </Button>
          </Grid>
        </Grid>
      )}
      {data &&
        data.listings.length > 0 &&
        data.listings.map((listing) => (
          <Grid container item key={listing.id} md={5} sm={7} xs={10}>
            <ListingItem listing={listing} />
          </Grid>
        ))}
      {data?.listings.length == 0 && (
        <Grid container item direction="column" alignItems="center">
          <Grid item>
            <Typography variant="body1" align="center">
              Det er for øyeblikket ingen verv tilgjengelige.
            </Typography>
          </Grid>
          <Grid item container direction="column" justifyContent="center" alignItems="center">
            <Box
              sx={{
                borderRadius: "50%",
                overflow: "hidden",
                width: (theme) => theme.spacing(50),
                height: (theme) => theme.spacing(50),
                maxWidth: "60vw",
                maxHeight: "60vw",
                display: "flex",
              }}
            >
              <Image src={EmptyStreet} alt="" layout="fixed" objectFit="cover" objectPosition="left bottom" />
            </Box>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default Listings;
