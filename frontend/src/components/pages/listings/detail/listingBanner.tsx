import { Listing } from "@interfaces/listings";
import { Box, makeStyles, Grid, Typography, Button, Hidden, Container } from "@material-ui/core";
import ArrowForward from "@material-ui/icons/ArrowForward";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import nb from "dayjs/locale/nb";
import Link from "next/link";
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault("Europe/Oslo");
dayjs.locale(nb);

const useStyles = makeStyles((theme) => ({
  root: {},
  cardRoot: {
    marginTop: "-5%",
    position: "relative",
    zIndex: 10,
  },
  hero: {
    width: "100%",
    maxHeight: "25vh",
    height: "25vh",
  },
  background: {
    background: "url(/nth.svg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.04,
  },
  cardContent: {
    padding: theme.spacing(4),
    objectPosition: "center",
  },
  deadline: {
    "&::before": {
      content: "'Frist '",
      fontWeight: "bold",
      color: theme.palette.primary.main,
    },
  },
  card: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
}));

/*
  component for the banner on the listing detail page (with "hero image")
  props: the listing for which to show the banner
*/
const ListingBanner: React.FC<{
  listing: Listing;
}> = ({ listing }) => {
  const classes = useStyles();
  return (
    <>
      <Box className={classes.root}>
        {listing.hero ? (
          <Box
            className={`${classes.hero}`}
            style={{
              background: `url(${listing.hero})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              opacity: 0.5,
            }}
          />
        ) : (
          <Box className={`${classes.background} ${classes.hero}`} />
        )}
        <Container>
          <Grid container direction="row" justify="center" alignItems="stretch" spacing={4}>
            <Grid
              container
              item
              xs={3}
              direction="column"
              justify="center"
              alignItems="stretch"
              className={classes.cardRoot}
            >
              <Grid
                container
                item
                direction="column"
                alignItems="center"
                justify="flex-start"
                className={`${classes.card} ${classes.cardContent}`}
              >
                <Grid item>
                  <Typography variant="h4" component="h2" align="center" gutterBottom>
                    {listing.organization?.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" component="span" align="center">
                    {listing.organization?.description}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              container
              item
              xs={7}
              direction="column"
              justify="center"
              alignItems="center"
              className={classes.cardRoot}
            >
              <Grid container item direction="column" justify="center" alignItems="stretch">
                <Grid
                  container
                  item
                  direction="row"
                  justify="space-between"
                  alignItems="stretch"
                  className={classes.card}
                >
                  <Grid
                    container
                    item
                    xs
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={classes.cardContent}
                  >
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
                        className={classes.deadline}
                        gutterBottom
                      >
                        {dayjs(listing.deadline).format("DD. MMMM YYYY [kl.] HH:mm")}
                      </Typography>
                    </Grid>
                    <Grid item>
                      {listing.url && (
                        <Link href={listing.url}>
                          <a>
                            <Button variant="contained" color="primary" endIcon={<ArrowForward />}>
                              Søk her
                            </Button>
                          </a>
                        </Link>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ListingBanner;
