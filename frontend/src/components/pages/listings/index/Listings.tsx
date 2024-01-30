import { useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import Image from "next/image";

import { Link } from "@/components";
import { ListingItem } from "@/components/pages/listings/index/ListingItem";
import { graphql } from "@/gql/pages";
import EmptyStreet from "public/illustrations/EmptyStreet.svg";

type Props = {
  /** Reload function to reload the page on error. */
  reload: () => void;
};

/** Component to show an overview of all open listings. */
export const Listings: React.FC<Props> = ({ reload }) => {
  // fetches all open listings
  const { loading, error, data } = useQuery(
    graphql(`
      query Listings {
        listings {
          listings {
            id
            name
            description
            closesAt
            organization {
              id
              name
            }
          }
        }
      }
    `)
  );

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
      {data?.listings.listings.map((listing) => (
        <Grid container item key={listing.id} md={5} sm={7} xs={10}>
          <ListingItem listing={listing} />
        </Grid>
      ))}
      {data?.listings.listings.length === 0 && (
        <Grid container item direction="column" alignItems="center">
          <Grid item>
            <Typography variant="body1" align="center">
              Det er for øyeblikket ingen verv tilgjengelige.
            </Typography>
          </Grid>
          <Grid container item direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={8} sm={5}>
              <Box
                sx={{ overflow: "hidden", borderRadius: "50%", width: "100%", aspectRatio: "1", position: "relative" }}
              >
                <Image src={EmptyStreet} alt="" fill style={{ objectFit: "contain", objectPosition: "center" }} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
