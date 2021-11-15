import { makeStyles, Grid, Box, Typography, Card, CardActionArea, CardMedia, CardContent } from "@material-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  card: {
    transition: "none !important",
  },
}));

interface Props {
  title: string;
  blogId: string;
}

export const BlogPostThumbnail: React.VFC<Props> = ({ title, blogId }) => {
  const classes = useStyles();
  const router = useRouter();
  const { orgId } = router.query;

  console.log(orgId);

  return (
    <>
      <Grid item md={4} sm={6} xs={12}>
        <Card className={classes.card}>
          <Link href={`${orgId}/${blogId}/`}>
            <CardActionArea>
              <CardMedia
                component="img"
                alt="Blogpost image"
                height="140"
                image="https://cdn.pixabay.com/photo/2018/06/17/20/35/chain-3481377__480.jpg"
                // Change to actual image when it's implemented
              />
              <CardContent>
                <Typography align="center" variant="subtitle2">
                  {title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Link>
        </Card>
      </Grid>
    </>
  );
};
