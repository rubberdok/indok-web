import { makeStyles, Grid, Box, Typography, Card, CardActionArea, CardMedia, CardContent } from "@material-ui/core";
import Placeholder from "@public/img/afterski.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

interface Props {
  title: string;
}

export const BlogPostThumbnail: React.VFC<Props> = ({ title }) => {
  const classes = useStyles();

  return (
    <>
      <Grid item md={4} sm={6} xs={12}>
        <Card>
          <CardActionArea>
            <CardMedia
              component="img"
              alt="Blogpost image"
              height="140"
              image="https://cdn.pixabay.com/photo/2018/06/17/20/35/chain-3481377__480.jpg"
              // Change to actual image when it's implemented
            />
            <CardContent>
              <Typography align="center">{title}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </>
  );
};
