import { Card, CardContent, CardMedia, CardActionArea, Typography, makeStyles, Grid, Avatar } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

import Link from "next/link";
import { Listing } from "@interfaces/listings";
import dayjs from "dayjs";
import { ThemeConsumer } from "styled-components";

interface ListingCardProps {
  listing: Listing;
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    padding: theme.spacing(0),
  },
  logo: {
    marginTop: "-50%",
  },
  description: {
    height: "6em",
    fontSize: theme.typography.body2.fontSize,
    padding: theme.spacing(2)
  },
  title: {
  },
  banner: {
    marginBottom: 0
  },
  content: {
    paddingTop: 0
  }
}));

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const classes = useStyles();
  return (
    <>
      <Card className={classes.root}>
        <Link href={`listings/${listing.id}/${listing.slug}/`} passHref>
          <CardActionArea className={classes.root}>
            <CardMedia component="img" image={"/img/bindeleddet.jpg"} className={classes.banner}/>
            <CardContent className={classes.content}>
              <Grid container direction="column" justify="center" alignItems="center">
                <Grid container item alignItems="center" justify="center">
                  <Grid item xs={2}>
                    <CardMedia className={classes.logo} component="img" image={"/img/tindoklogo.png"} />
                  </Grid>
                </Grid>

                <Grid container item alignItems="center" direction="column">
                  <Grid item className={classes.title}>
                    <Typography variant="h5" component="h2">
                      {listing.title}
                    </Typography>
                  </Grid>
                  <Grid item className={classes.description} zeroMinWidth>
                    <Typography variant="body2" component="span">
                      {listing.description}
                    </Typography>
                  </Grid>
                  <Grid container item direction="row" justify="center">
                    <Grid item>
                      <Typography variant="caption" component="span">
                        {dayjs(listing.deadline).format("DD. MMM YYYY")}
                      </Typography>
                    </Grid>
                    <Grid container item direction="row" justify="space-between" alignItems="center">
                      {["intervju", "case", "søknad"].map((chip) => (
                        <Grid container xs={4} item direction="column" alignItems="center" key={chip}>
                          <Grid item>
                            <Typography variant="caption" component="span">
                              {chip}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CheckIcon />
                          </Grid>
                        </Grid>
                      ))}
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

export default ListingCard;
