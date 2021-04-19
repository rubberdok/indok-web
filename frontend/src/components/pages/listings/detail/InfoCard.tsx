import { Listing } from "@interfaces/listings";
import { Button, Grid, makeStyles, Typography, CardContent, Card } from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
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
}));

/**
 * Component for title and organization info on the listing detail page.
 *
 * Props:
 * - the listing to render
 */
const InfoCard: React.FC<{
  listing: Listing;
}> = ({ listing }) => {
  const classes = useStyles();
  return (
    <Card style={{ height: "100%" }}>
      <CardContent style={{ height: "100%" }}>
        <Grid container direction="column" alignItems="center" justify="space-between" style={{ height: "100%" }}>
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
            <Link passHref href={`/about/organizations/${listing.organization?.slug}`}>
              <Button endIcon={<OpenInNewIcon />}>Les mer</Button>
            </Link>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
