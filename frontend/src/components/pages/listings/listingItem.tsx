import { Listing } from "@interfaces/listings";
import { Card, CardActionArea, CardContent, CardMedia, Grid, makeStyles, Typography } from "@material-ui/core";
import Link from "next/link";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb"

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },

  media: {
    height: 150,
    objectFit: "contain",
  },
}));

interface ListItemProps {
  listing: Listing;
}

const ListingItem: React.FC<ListItemProps> = ({ listing }) => {
  const classes = useStyles();

  return (
    <Link href={`/listings/${listing.id}/${listing.slug}`}>
      <Grid item xs>
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              component="img"
              className={classes.media}
              image={
                listing.organization?.color ||
                "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              }
              title="organization logo"
            />
            <CardContent>
              <Grid container direction="column">
                <Grid item xs={12}>
                  <Typography variant="h5" component="h2">
                    {listing.title}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" component="span" >
                    {dayjs(listing.deadline).locale(nb).format("D. MMMM")}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography component="p">{listing.organization?.name || "N/A"}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Link>
  );
};

export default ListingItem;
