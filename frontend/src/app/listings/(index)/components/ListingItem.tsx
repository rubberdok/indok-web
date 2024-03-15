import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import Image from "next/image";

import { Link } from "@/app/components/Link";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import dayjs from "@/lib/date";

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

type Props = {
  listing: FragmentType<typeof ListingFragment>;
};

const ListingFragment = graphql(`
  fragment ListingItem_Listing on Listing {
    id
    name
    closesAt
    organization {
      id
      name
      logo {
        id
        url
      }
    }
  }
`);

/** Component for listing item in overview of listings. */
export const ListingItem: React.FC<Props> = (props) => {
  const listing = getFragmentData(ListingFragment, props.listing);
  return (
    <Card sx={{ width: "100%", height: "100%" }}>
      <CardActionArea
        sx={{ width: "100%", height: "100%" }}
        component={Link}
        href={`listings/${listing.id}`}
        noLinkStyle
      >
        <CardMedia
          component="img"
          sx={{
            height: "10em",
            objectFit: "cover",
            background: "url('/nth.svg')",
            opacity: 0.1,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            /* Primary color */
            backgroundColor: "rgba(11,60,60,0.5)",
          }}
        />
        <CardContent sx={{ paddingTop: 0, position: "relative" }}>
          <Box
            sx={(theme) => ({
              objectFit: "contain",
              position: "relative",
              borderRadius: "100%",
              overflow: "hidden",
              objectPosition: "center",
              background: theme.vars.palette.background.paper,
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
            <Image unoptimized fill src={listing.organization.logo?.url || "/nth.svg"} alt="" />
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
                {listing.name}
              </Typography>
            </Grid>
            <Grid item sx={{ textAlign: "center" }}>
              <Typography variant="caption" component="p">
                <b>Frist: </b>
                {timestamp(listing.closesAt)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
