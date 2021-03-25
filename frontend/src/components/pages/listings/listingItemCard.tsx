import { makeStyles, Grid, Card, Typography, Chip, CardMedia, CardActionArea } from "@material-ui/core";
import People from "@material-ui/icons/People";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  media: {
    objectFit: "cover",
  },
  card: {
    width: "100%",
  },
  descriptionText: {
    /* https://stackoverflow.com/questions/3922739/limit-text-length-to-n-lines-using-css */
    /* Limits the description text to three lines. lines = maxHeight / lineHeight */
    display: "inline-block" /* or inline-block */,
    textOverflow: "ellipsis",
    wordWrap: "break-word",
    overflow: "hidden",
    maxHeight: "3.6em",
    lineHeight: "1.8em",
  },
  content: {
    padding: theme.spacing(4),
  },
}));

// alternative view of ListingItem
// currently not used, but may be used in the future
const ListingItemCard: React.FC<{
  title: string;
  subtitle?: string;
  survey?: boolean;
  number?: number;
  img: string;
  chips: string[];
  id: string;
  slug: string;
}> = ({ title, subtitle, img, number, chips, id, slug }) => {
  const classes = useStyles();
  return (
    <>
      <Card className={classes.card}>
        <Link href={`listings/${id}/${slug}`} passHref>
          <CardActionArea
            style={{
              padding: `0`,
            }}
          >
            <Grid container direction="row" spacing={2}>
              <Grid item xs={2}>
                <CardMedia component="img" image={img} className={classes.media} />
              </Grid>
              <Grid
                container
                item
                xs={10}
                className={classes.content}
                direction="column"
                justify="space-between"
                alignItems="stretch"
              >
                <Grid item xs>
                  <Typography variant="h5" component="h2">
                    {title}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="body2" component="span" className={classes.descriptionText}>
                    {subtitle}
                  </Typography>
                </Grid>
                <Grid xs container item direction="row" spacing={1}>
                  <Grid item>
                    <Chip label={number} icon={<People />} />
                  </Grid>
                  {chips.map((chip, index) => (
                    <Grid item key={index}>
                      <Chip label={chip} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </CardActionArea>
        </Link>
      </Card>
    </>
  );
};

export default ListingItemCard;
