import { ResultOf } from "@graphql-typed-document-node/core";
import { ArrowForward } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Divider, Grid, Typography, Link as MuiLink } from "@mui/material";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Image from "next/future/image";
import Link from "next/link";
import React from "react";

import { ListingDocument } from "@/generated/graphql";

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault("Europe/Oslo");
dayjs.locale(nb);

/**
 * Component for title and organization info on the listing detail page.
 *
 * Props:
 * - the listing to render
 */
const TitleCard: React.FC<{
  listing: ResultOf<typeof ListingDocument>["listing"];
}> = ({ listing }) => {
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
              <Link href={listing.readMoreUrl} passHref>
                <MuiLink target="_blank" color="text.primary">
                  <Typography variant="h4" component="h4" align="center" gutterBottom>
                    {listing?.organization.name}
                  </Typography>
                </MuiLink>
              </Link>
            ) : (
              <Typography variant="h4" component="h4" align="center" gutterBottom>
                {listing?.organization.name}
              </Typography>
            )}
            <Divider sx={{ my: 2, display: { xs: "none", sm: "block" } }} />
            <Typography variant="caption" component="h3" align="center" gutterBottom>
              {`Frist ${dayjs(listing?.deadline).format("DD. MMMM YYYY [kl.] HH:mm")}`}
            </Typography>
            {link && (
              <Grid container item justifyContent="center">
                <Link href={link} passHref>
                  <Button variant="contained" color="primary" endIcon={<ArrowForward />}>
                    Søk her
                  </Button>
                </Link>
              </Grid>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TitleCard;
