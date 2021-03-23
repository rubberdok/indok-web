import { Listing } from "@interfaces/listings";
import {
  Box,
  makeStyles,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  CardMedia,
} from "@material-ui/core";
import ArrowForward from "@material-ui/icons/ArrowForward";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import nb from "dayjs/locale/nb";
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault("Europe/Oslo");
dayjs.locale(nb);

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
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
  container: {
    position: "relative",
    display: "inline-block",
    width: "100%",
    height: "100%",
    "&::before": {
      content: "''",
      display: "block",
      paddingTop: "33%",
    }
  },
  backdrop: {
    marginTop: "-5%",
    padding: theme.spacing(2),
    backgroundColor: "white",
    width: "100%",
    objectPosition: "center",
  },
  titleContent: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    objectPosition: "center",
    width: "100%",
    height: "100%",
  },
  deadline: {
    "&::before": {
      content: "'Frist '",
      fontWeight: "bold",
      color: theme.palette.primary.main
    }
  },
  card: {
    position: "relative",
    zIndex: 10,
  }
}));

interface HeroProps {
  listing: Listing,
  buttonText?: string
}

const Hero: React.FC<HeroProps> = ({ listing, buttonText }) => {
  const classes = useStyles();
  return (
    <>
      <Box className={classes.root}>
        <Box className={`${classes.background} ${classes.hero}`} />
        <Grid container direction="column" justify="space-between" alignItems="center" className={classes.card}>
          <Grid container item xs={6} direction="column" justify="center" alignItems="center" className={classes.backdrop}>
            <Grid container item className={classes.container} direction="column" justify="center" alignItems="center">
              <Grid container item direction="column" justify="space-between" alignItems="center" className={classes.titleContent}>
                <Grid container item direction="column" justify="flex-start" alignItems="center">
                  <Grid item>
                    <Typography variant="h1" component="h1" align="center">
                      {listing.title}
                    </Typography>
                  </Grid>
                  {listing.organization &&
                    <Grid item>
                      <Typography variant="subtitle1" component="h2" align="center">
                        {listing.organization.name}
                      </Typography>
                    </Grid>
                  }
                  <Grid item>
                    <Typography variant="subtitle2" component="h3" align="center" className={classes.deadline}>
                      {dayjs(listing.deadline).format("DD. MMMM YYYY [kl.] HH:mm")}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" endIcon={<ArrowForward />}>
                    Søk her
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Hero;
