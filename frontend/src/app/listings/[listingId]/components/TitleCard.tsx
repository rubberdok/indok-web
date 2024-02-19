import { ArrowForward } from "@mui/icons-material";
import { Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import React from "react";

import { Link } from "@/app/components/Link";
import dayjs from "@/lib/date";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";

type Props = {
  listing: FragmentType<typeof ListingFragment>;
};

const ListingFragment = graphql(`
  fragment TitleCard_Listing on Listing {
    name
    applicationUrl
    closesAt
    organization {
      id
      name
    }
  }
`);

/** Component for title and organization info on the listing detail page. */
export const TitleCard: React.FC<Props> = (props) => {
  const listing = getFragmentData(ListingFragment, props.listing);
  return (
    <Card>
      <CardContent>
        <Grid container direction={{ xs: "row", sm: "column" }} spacing={4} justifyContent="center" alignItems="center">
          <Grid container xs sm={12} item direction="column">
            <Typography variant="h4" component="h4" align="center" gutterBottom>
              {listing.organization.name}
            </Typography>
            <Divider sx={{ my: 2, display: { xs: "none", sm: "block" } }} />
            <Typography variant="caption" component="h3" align="center" gutterBottom>
              {`Frist ${dayjs(listing.closesAt).format("LLL")}`}
            </Typography>
            {listing.applicationUrl && (
              <Grid container item justifyContent="center">
                <Button
                  component={Link}
                  href={listing.applicationUrl}
                  noLinkStyle
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForward />}
                >
                  Søk her
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
