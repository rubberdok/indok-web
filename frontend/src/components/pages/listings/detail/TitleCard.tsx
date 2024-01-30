import { ArrowForward } from "@mui/icons-material";
import { Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import React from "react";

import { Link } from "@/components";
import dayjs from "@/lib/date";

type Props = {
  listing?: {
    name: string;
    applicationUrl: string;
    closesAt: string;
    organization: {
      name: string;
    };
  };
};

/** Component for title and organization info on the listing detail page. */
export const TitleCard: React.FC<Props> = ({ listing }) => {
  return (
    <Card>
      <CardContent>
        <Grid container direction={{ xs: "row", sm: "column" }} spacing={4} justifyContent="center" alignItems="center">
          <Grid container xs sm={12} item direction="column">
            <Typography variant="h4" component="h4" align="center" gutterBottom>
              {listing?.organization.name}
            </Typography>
            <Divider sx={{ my: 2, display: { xs: "none", sm: "block" } }} />
            <Typography variant="caption" component="h3" align="center" gutterBottom>
              {`Frist ${dayjs(listing?.closesAt).format("LLL")}`}
            </Typography>
            {listing?.applicationUrl && (
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
