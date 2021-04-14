import { Listing } from "@interfaces/listings";
import { Button, Grid, Hidden, makeStyles, Typography, Paper, CardContent, Card, CardActions } from "@material-ui/core";
import ArrowForward from "@material-ui/icons/ArrowForward";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault("Europe/Oslo");
dayjs.locale(nb);

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 10,
    [theme.breakpoints.up("md")]: {
      marginTop: "-7%",
    },
  },
  deadline: {
    "&::before": {
      content: "'Frist '",
      fontWeight: "bold",
      color: theme.palette.primary.main,
    },
  },
  card: {
    height: "100%",
    width: "100%",
    maxWidth: "100%",
    padding: theme.spacing(4),
    [theme.breakpoints.down("xs")]: {
      minWidth: "min-content",
    },
  },
  descriptionText: {
    /* https://stackoverflow.com/a/13924997 */
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 3 /* number of lines to show */,
    "-webkit-box-orient": "vertical",
  },
  organizationName: {
    [theme.breakpoints.down("md")]: {
      fontSize: theme.typography.h6.fontSize,
    },
  },
  fullHeight: {
    height: "100%",
  }
}));

/**
 * component for title and organization info on the listing detail page
 * props: the listing to render
 */
const ListingTitle: React.FC<{
  listing: Listing;
}> = ({ listing }) => {
  const classes = useStyles();
  return (
    <Grid container direction="row" justify="space-between" alignItems="stretch" className={classes.root}>
      <Hidden smDown>
        <Grid container item xs={4} alignItems="stretch" style={{marginRight: 32}}>
          <Card>
            <CardContent>
              <Grid container direction="column" alignItems="center" justify="space-between" className={classes.fullHeight} spacing={2}>
                <Grid item>
                  <Typography
                    variant="h5"
                    component="h2"
                    className={`${classes.organizationName} ${classes.descriptionText}`}
                    align="center"
                  >
                    {listing.organization?.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="caption" align="center" component="span" className={classes.descriptionText}>
                    {listing.organization?.description}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button endIcon={<OpenInNewIcon />} href={`/about/organizations/${listing.organization?.slug}`}>
                    Les mer
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Hidden>

      <Grid item xs>
        <Card className={classes.fullHeight}>
          <CardContent>
            <Grid container direction="column" justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h3" component="h1" align="center">
                  {listing.title}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" component="h3" align="center" className={classes.deadline} gutterBottom>
                  {dayjs(listing.deadline).format("DD. MMMM YYYY [kl.] HH:mm")}
                </Typography>
              </Grid>
              <Hidden xsDown>
                <Grid item>
                  {listing.url && (
                    <Link href={listing.url} passHref>
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
      </Grid>
    </Grid>
  );
};

export default ListingTitle;
