import { Listing } from "@interfaces/listings";
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography, Chip, Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import relativeTime from "dayjs/plugin/isSameOrAfter";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import * as markdownComponents from "@components/markdown/components";

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.tz.setDefault("Europe/Oslo");
dayjs.locale(nb);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    padding: 0,
  },
  logo: {
    objectFit: "contain",
    objectPosition: "center",
    marginBottom: theme.spacing(2),
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
  },
  descriptionText: {
    /* https://stackoverflow.com/a/13924997 */
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2 /* number of lines to show (almost) */,
    "-webkit-box-orient": "vertical",
    minHeight: "4em",
    marginTop: theme.spacing(2),
  },
  hero: {
    height: "10em",
    objectFit: "cover",
    opacity: 0.65,
  },
  content: {
    paddingTop: 0,
    position: "relative",
  },
  background: {
    background: "url('/nth.svg')",
    opacity: 0.1,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    /* Primary color */
    backgroundColor: "rgba(11,60,60,0.5)",
  },
}));

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

/**
 * Component for listing item in overview of listings.
 *
 * Props:
 * - the listing to render
 */
const ListingItem: React.FC<{
  listing: Listing;
}> = ({ listing }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <Link href={`listings/${listing.id}/${listing.slug}/`} passHref>
        <CardActionArea className={classes.root}>
          <CardMedia
            component="img"
            image={listing.heroImageUrl ? listing.heroImageUrl : ""}
            className={`${classes.hero} ${!listing.heroImageUrl ? classes.background : ""}`}
          />
          <CardContent className={classes.content}>
            <img
              src={listing.organization?.logoUrl || "/nth.svg"}
              className={classes.logo}
              alt="Foreningslogo"
              onError={(e) => (
                ((e.target as HTMLImageElement).onerror = null), ((e.target as HTMLImageElement).src = "/nth.svg")
              )}
            />
            <Box px={3} display="flex" flexDirection="column" justifyContent="space-between">
              <Box overflow="hidden" textAlign="center" height="12em">
                <Typography variant="h5" component="h2">
                  {listing.title}
                </Typography>
                <Typography variant="caption" component="p">
                  <b>Frist: </b>
                  {timestamp(listing.deadline)}
                </Typography>
                <ReactMarkdown
                  allowedElements={["p", "em", "strong", "a"]}
                  className={classes.descriptionText}
                  components={markdownComponents}
                >
                  {listing.description}
                </ReactMarkdown>
              </Box>
              <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
                {listing.chips.map((chip) => (
                  <Grid item key={chip}>
                    <Chip
                      label={translateChip(chip)}
                      size="small"
                      style={{
                        fontSize: 12,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default ListingItem;
