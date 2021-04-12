import { Listing } from "@interfaces/listings";
import { Button, Grid, Hidden, makeStyles, Typography } from "@material-ui/core";
import ArrowForward from "@material-ui/icons/ArrowForward";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import InfoCard from "./InfoCard";
import TitleCard from "./TitleCard";
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
  descriptionText: {
    /* https://stackoverflow.com/a/13924997 */
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2 /* number of lines to show */,
    "-webkit-box-orient": "vertical",
  },
  organizationName: {
    [theme.breakpoints.down("md")]: {
      fontSize: theme.typography.h6.fontSize,
    },
  },
}));

/**
 * component for title and organization info on the listing detail page
 * props: the listing to render
 */
const ListingTitle: React.FC<{
  listing: Listing;
}> = ({ listing }) => {
  const classes = useStyles();

  const Deadline: React.FC<{ deadline: string }> = ({ deadline }) => (
    <Typography variant="caption" component="h3" align="center" className={classes.deadline} gutterBottom>
      {dayjs(deadline).format("DD. MMMM YYYY [kl.] HH:mm")}
    </Typography>
  )

  const Title: React.FC<{ title: string }> = ({ title }) => (
    <Typography variant="h3" component="h1" align="center">
      {title}
    </Typography>
  )

  const Apply: React.FC<{ url: string }> = ({ url }) => (
    <>
      {url &&
        <Link href={url} passHref>
          <Button variant="contained" color="primary" endIcon={<ArrowForward />}>
            Søk her
          </Button>
        </Link>
      }
    </>
  )

  const OrganizationName: React.FC<{ name: string }> = ({ name }) => (
    <Typography
    variant="h5"
    component="h2"
    className={`${classes.organizationName} ${classes.descriptionText}`}
    >
      {name}
    </Typography>
  )

  const OrganizationDescription: React.FC<{description: string}> = ({ description }) => (
    <Typography variant="caption" align="center" component="span" className={classes.descriptionText}>
      {description}
    </Typography>
  )

  const About: React.FC<{slug: string}> = ({ slug }) => (
    <Button endIcon={<OpenInNewIcon />} href={`/about/organizations/${slug}`}>
      Les mer
    </Button>
  )

  return (
    <Grid container item direction="row" justify="space-between" alignItems="stretch" className={classes.root}>
      {listing.organization && 
        <Hidden smDown>
          <Grid item xs={4} style= {{ marginRight: 32 }}>
            <InfoCard
              title={<OrganizationName name={listing.organization.name} />}
              description={<OrganizationDescription description={listing.organization.description} />}
              action={<About slug={listing.organization.slug} />}
            />
          </Grid>
        </Hidden>
      }
      <Grid item xs>
        <TitleCard
          title={<Title title={listing.title} />}
          subtitle={<Deadline deadline={listing.deadline} />}
          action={<Apply url={listing.url} />}
        />
      </Grid>
    </Grid>
  );
};

export default ListingTitle;
