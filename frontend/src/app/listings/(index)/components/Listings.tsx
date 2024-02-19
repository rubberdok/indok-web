import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";

import { ListingItem } from "./ListingItem";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import EmptyStreet from "public/illustrations/EmptyStreet.svg";

type Props = {
  query: FragmentType<typeof ListingsQueryFragment>;
};

const ListingsQueryFragment = graphql(`
  fragment Listings_Query on Query {
    listings {
      listings {
        id
        ...ListingItem_Listing
        organization {
          id
          name
        }
      }
    }
  }
`);

/** Component to show an overview of all open listings. */
export const Listings: React.FC<Props> = (props) => {
  const query = getFragmentData(ListingsQueryFragment, props.query);
  const listings = query.listings.listings;
  // if the data is fetched, renders a ListingItem for each listing
  return (
    <Grid container direction="row" spacing={2} justifyContent="center" alignItems="stretch">
      {listings.map((listing) => (
        <Grid container item key={listing.id} md={5} sm={7} xs={10}>
          <ListingItem listing={listing} />
        </Grid>
      ))}
      {listings.length === 0 && (
        <Grid container item direction="column" alignItems="center">
          <Grid item>
            <Typography variant="body1" align="center">
              Det er for øyeblikket ingen verv tilgjengelige.
            </Typography>
          </Grid>
          <Grid container item direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={8} sm={5}>
              <Box
                sx={{
                  overflow: "hidden",
                  borderRadius: "50%",
                  width: "100%",
                  aspectRatio: "1",
                  position: "relative",
                }}
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
