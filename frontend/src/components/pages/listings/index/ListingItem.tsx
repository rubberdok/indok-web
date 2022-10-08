import { Box, Card, CardActionArea, CardContent, CardMedia, Chip, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import relativeTime from "dayjs/plugin/isSameOrAfter";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";

import { ListingFragment } from "@/generated/graphql";

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.tz.setDefault("Europe/Oslo");
dayjs.locale(nb);

const timestamp = (datetime: string) => {
  // returns monday 23:59 if < 2 days remaining, 02. february 1999 otherwise
  const now = dayjs();
  const deadline = dayjs(datetime);
  if (now.add(2, "day").isSameOrAfter(deadline)) {
    return deadline.format("dddd HH:mm");
  } else {
    return deadline.format("DD. MMMM YYYY [kl.] HH:mm");
  }
};

const translateChip = (chip: string) => {
  switch (chip) {
    case "application":
      return "søknad";
    case "interview":
      return "intervju";
    default:
      return chip;
  }
};

type Props = { listing: ListingFragment };

/** Component for listing item in overview of listings. */
const ListingItem: React.FC<Props> = ({ listing }) => {
  return (
    <Card sx={{ width: "100%", height: "100%" }}>
      <Link href={`listings/${listing.id}/${listing.slug}/`} passHref>
        <CardActionArea sx={{ width: "100%", height: "100%" }}>
          <CardMedia
            component="img"
            image={listing.heroImageUrl ? listing.heroImageUrl : ""}
            sx={{
              height: "10em",
              objectFit: "cover",
              opacity: 0.65,
              ...(!listing.heroImageUrl && {
                background: "url('/nth.svg')",
                opacity: 0.1,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                /* Primary color */
                backgroundColor: "rgba(11,60,60,0.5)",
              }),
            }}
          />
          <CardContent sx={{ paddingTop: 0, position: "relative" }}>
            <Box
              sx={(theme) => ({
                objectFit: "contain",
                objectPosition: "center",
                background: theme.palette.background.paper,
                [theme.breakpoints.up("sm")]: {
                  margin: "-50px auto 0",
                  width: 112,
                  height: 112,
                },
                [theme.breakpoints.down("sm")]: {
                  margin: "-44px auto 0",
                  width: 100,
                  height: 100,
                },
              })}
            >
              <img
                src={listing.organization?.logoUrl || "/nth.svg"}
                alt=""
                onError={(e) => (
                  ((e.target as HTMLImageElement).onerror = null), ((e.target as HTMLImageElement).src = "/nth.svg")
                )}
              />
            </Box>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              sx={{ marginTop: (theme) => theme.spacing(4) }}
            >
              <Grid item sx={{ textAlign: "center" }}>
                <Typography variant="h5" component="h2">
                  {listing.title}
                </Typography>
              </Grid>
              <Grid item sx={{ textAlign: "center" }}>
                <Typography variant="caption" component="p">
                  <b>Frist: </b>
                  {timestamp(listing.deadline)}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ marginTop: (theme) => theme.spacing(4) }}
            >
              {listing.chips.map((chip) => (
                <Grid item key={chip}>
                  <Chip label={translateChip(chip)} size="small" />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default ListingItem;
