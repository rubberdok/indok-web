import { ListingDocument } from "@generated/graphql";
import { ResultOf } from "@graphql-typed-document-node/core";
import { ArrowForward } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Image from "next/future/image";
import Link from "next/link";
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
  listing: NonNullable<ResultOf<typeof ListingDocument>["listing"]>;
}> = ({ listing }) => {
  let link: string | undefined = undefined;
  if (listing.form) {
    link = `/forms/${listing.form.id}/`;
  } else if (listing?.applicationUrl) {
    link = listing.applicationUrl;
  } else {
    link = "";
  }

  return (
    <Card>
      <CardContent>
        <Stack direction={{ xs: "row", sm: "column" }} spacing={4} justifyContent="center" alignItems="center">
          {listing.organization.logoUrl && (
            <Box position="relative" width="100%" height={{ xs: "100px", sm: "150px" }}>
              <Image
                src={listing.organization.logoUrl}
                unoptimized
                fill
                style={{ objectFit: "contain", objectPosition: "center", aspectRatio: "1" }}
              />
            </Box>
          )}
          <Stack direction="column" justifyContent="center" alignItems="center">
            <Typography variant="h4" component="h4" align="center" gutterBottom>
              {listing.organization.name}
            </Typography>
            <Typography variant="caption" component="h3" align="center" gutterBottom>
              {`Frist ${dayjs(listing.deadline).format("DD. MMMM YYYY [kl.] HH:mm")}`}
            </Typography>
            {link && (
              <Box>
                <Link href={link} passHref>
                  <Button variant="contained" color="primary" endIcon={<ArrowForward />}>
                    Søk her
                  </Button>
                </Link>
              </Box>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TitleCard;
