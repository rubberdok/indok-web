import { ListingQuery } from "@generated/graphql-deprecated";
import { ArrowForward } from "@mui/icons-material";
import { Button, Card, CardContent, Grid, Hidden, Typography } from "@mui/material";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
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
  listing: NonNullable<ListingQuery["listing"]>;
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
    <Card style={{ height: "100%" }}>
      <CardContent>
        <Grid container direction="column" justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h1" align="center">
              {listing.title}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="caption"
              component="h3"
              align="center"
              sx={{
                "&::before": {
                  content: "'Frist '",
                  fontWeight: "bold",
                  color: (theme) => theme.palette.primary.main,
                },
              }}
              gutterBottom
            >
              {dayjs(listing.deadline).format("DD. MMMM YYYY [kl.] HH:mm")}
            </Typography>
          </Grid>
          <Hidden smDown>
            <Grid item>
              {link && (
                <Link href={link} passHref>
                  <Button variant="contained" color="primary" endIcon={<ArrowForward />}>
                    Søk her
                  </Button>
                </Link>
              )}
            </Grid>
          </Hidden>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TitleCard;
