import { Card, CardContent, CardMedia, CardActionArea, Typography, makeStyles, Grid, Chip } from "@material-ui/core";
import People from "@material-ui/icons/People";

import Link from "next/link";
import { Listing } from "@interfaces/listings";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/isSameOrAfter";
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.tz.setDefault("Europe/Oslo");
dayjs.locale(nb);

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
    width: "100%",
    height: "100%",
  },
  logo: {
    objectFit: "contain",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    objectPosition: "center",
    width: "100%",
    height: "100%",
  },
  description: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  descriptionText: {
    /* https://stackoverflow.com/a/13924997 */
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 3 /* number of lines to show */,
    "-webkit-box-orient": "vertical",
    minHeight: "4em",
  },
  title: {},
  hero: {
    marginBottom: 0,
    maxHeight: "10em",
    height: "10em",
    objectFit: "cover",
    position: "relative",
    opacity: 0.65,
    zIndex: 0,
  },
  content: {
    paddingTop: 0,
    position: "relative",
    zIndex: 10,
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
  deadline: {
    ["&::before"]: {
      color: theme.palette.primary.main,
      content: "'Frist '",
      fontWeight: "bold",
    },
  },
  logoContainer: {
    /* 
    https://stackoverflow.com/a/51447865
    Maintain a 1:1 aspect ratio on the logo content  
    */
    display: "inline-block",
    position: "relative",
    width: "100%",
    "&::before": {
      content: "''",
      display: "block",
      paddingTop: "100%",
    },
  },
  logoBackdrop: {
    marginTop: "-50%",
    padding: 2,
    backgroundColor: "white",
    width: "100%",
    maxWidth: "6em",
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

// component for listing item in overview of listings
const ListingItem: React.FC<{
  listing: Listing;
}> = ({ listing }) => {
  const classes = useStyles();
  return (
    <>
      <Card className={classes.root}>
        <Link href={`listings/${listing.id}/${listing.slug}/`} passHref>
          <CardActionArea className={classes.root}>
            <CardMedia
              component="img"
              image={listing.hero ? listing.hero : ""}
              className={`${classes.hero} ${!listing.hero ? classes.background : ""}`}
            />
            <CardContent className={classes.content}>
              <Grid container direction="column" alignItems="center">
                <Grid container item alignItems="center" justify="center" xs={3}>
                  <Grid container item className={classes.logoBackdrop} alignItems="center" justify="center">
                    <Grid container item className={classes.logoContainer} alignItems="center" justify="center">
                      <img
                        src={
                          listing.organization ? `/img/${listing.organization.name.toLowerCase()}logo.png` : "/nth.sv"
                        }
                        className={classes.logo}
                        alt="Organisasjonslogo"
                        onError={(e) => ((e.target.onerror = null), (e.target.src = "/nth.svg"))}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  justify="space-between"
                  alignItems="center"
                  direction="column"
                  style={{ height: `100%` }}
                >
                  <Grid item className={classes.title}>
                    <Typography variant="h5" component="h2" align="center">
                      {listing.title}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption" component="span" className={classes.deadline}>
                      {timestamp(listing.deadline)}
                    </Typography>
                  </Grid>
                  <Grid container item className={classes.description} justify="center">
                    <Typography variant="body2" component="span" className={classes.descriptionText} align="center">
                      {listing.description}
                    </Typography>
                  </Grid>
                  <Grid container item direction="row" justify="center">
                    <Grid container item direction="row" justify="center" alignItems="center" spacing={2}>
                      {["intervju", "søknad", "case"].map((chip) => (
                        <Grid item key={chip}>
                          <Chip
                            label={chip}
                            size="small"
                            style={{
                              fontSize: 12,
                            }}
                          />
                        </Grid>
                      ))}
                      {
                        <Grid item>
                          <Chip
                            label={15}
                            icon={<People />}
                            size="small"
                            style={{
                              fontSize: 12,
                            }}
                          />
                        </Grid>
                      }
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Link>
      </Card>
    </>
  );
};

export default ListingItem;
