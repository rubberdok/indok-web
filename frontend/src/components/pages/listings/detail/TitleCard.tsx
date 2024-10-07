import { ArrowForward } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Divider, Grid, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

import { Link } from "@/components";
import { ListingWithFormIdFragment } from "@/generated/graphql";
import dayjs from "@/lib/date";

type Props = { listing?: ListingWithFormIdFragment };

/** Component for title and organization info on the listing detail page. */
export const TitleCard: React.FC<Props> = ({ listing }) => {
  let link: string | undefined = undefined;
  if (listing?.form) {
    link = `/forms/${listing.form.id}/`;
  } else if (listing?.applicationUrl) {
    link = listing.applicationUrl;
  } else {
    link = "";
  }

  return (
    <Card>
      <CardContent>
        <Grid container direction={{ xs: "row", sm: "column" }} spacing={4} justifyContent="center" alignItems="center">
          {listing?.organization.logoUrl && (
            <Grid container item xs={4} sm={12}>
              <Box position="relative" height="150px" width="100%">
                <Image
                  src={listing?.organization.logoUrl}
                  unoptimized
                  fill
                  alt=""
                  style={{ objectFit: "contain", objectPosition: "center", aspectRatio: "1" }}
                />
              </Box>
            </Grid>
          )}
          <Grid container xs sm={12} item direction="column">
            {listing?.readMoreUrl ? (
              <Link href={listing.readMoreUrl} target="_blank" noLinkStyle>
                <Typography variant="h4" component="h4" align="center" gutterBottom>
                  {listing?.organization.name}
                </Typography>
              </Link>
            ) : (
              <Typography variant="h4" component="h4" align="center" gutterBottom>
                {listing?.organization.name}
              </Typography>
            )}
            <Divider sx={{ my: 2, display: { xs: "none", sm: "block" } }} />
            <Typography variant="caption" component="h3" align="center" gutterBottom>
              {`Frist ${dayjs(listing?.deadline).format("LLL")}`}
            </Typography>
            {link && (
              <Tooltip
                title={
                  dayjs(listing?.deadline).isBefore(dayjs())
                    ? "Fristen for dette vervet har gått ut. Hvis du tror dette er en feil sjekk årstallet på fristen. Hvis du fortsatt tror det er en feil ta kontakt med vervet."
                    : ""
                }
              >
                <Grid container item justifyContent="center">
                  <Button
                    component={Link}
                    href={link}
                    noLinkStyle
                    variant="contained"
                    disabled={dayjs(listing?.deadline).isBefore(dayjs())}
                    color="primary"
                    endIcon={<ArrowForward />}
                  >
                    Søk her
                  </Button>
                </Grid>
              </Tooltip>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
