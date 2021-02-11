import { Listing } from "@interfaces/listings";
import Link from "next/link"
import {
  Grid,
  Card,
  CardContent,
  Typography,
  makeStyles,
  CardActions,
  CardMedia,
  CardActionArea,
} from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },

  media: {
    height: 150,
    objectFit: "contain",
  }

});

interface ListItemProps {
  listing: Listing
};

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
              image={listing.organization?.color || "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"}
              title="organization logo"
            />
            <CardContent>
              <Typography gutterBottom variant="h4" component="h4">{listing.title}</Typography>
              <Typography variant="p" component="p">{listing.organization?.name || "N/A"}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Link>
  )
};

export default ListingItem; 