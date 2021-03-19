import { CardContent, makeStyles, Grid, Card, Typography, Chip, CardMedia, CardActionArea } from "@material-ui/core";
import People from "@material-ui/icons/People"

interface ListingItemCardProps {
  title: string,
  subtitle?: string,
  survey?: Boolean,
  number?: Number,
  img: string,
  chips: string[]
}

const useStyles = makeStyles((theme) => ({
  root: {
    height:"200px"
  },
  media: {
    objectFit: "cover",
    height: "200px",
    width: "200px",
    minWidth: "200px"
  },
  content: {
    padding: theme.spacing(2)
  }
}));


const ListingItemCard: React.FC<ListingItemCardProps> = ({ title, subtitle, img, number, chips }) => {
  const classes = useStyles();
  return (
    <>
      <Card className={classes.root}>
        <CardActionArea style={{
          padding: `0`,
        }}>
          <Grid container direction="row" spacing={2}>
            <Grid item>
              <CardMedia
                component="img"
                image={img}
                className={classes.media}
              />
            </Grid>
            <Grid container xs className={classes.content}>
              <Grid container direction="column" justify="space-between" alignItems="stretch">
                <Grid item xs>
                  <Typography variant="h5" component="h2">
                    {title} HEIHEIHEI
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="body2" component="span">
                    {subtitle}
                  </Typography>
                </Grid>
                <Grid xs container direction="row" spacing={1}>
                  <Grid item>
                    <Chip label={number} icon={<People />}/>
                  </Grid>
                  {chips.map((chip) => (
                    <Grid item>
                      <Chip label={chip} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

        </CardActionArea>
      </Card>
    </>
  )

};

export default ListingItemCard;