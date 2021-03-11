import Layout from "@components/Layout";
import { Box, Button, Card, CardContent, CardMedia, Container, makeStyles, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { getSortedPosts } from "@utils/posts";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";

type Props = {
  slug: string;
  frontmatter: {
    description: string;
    title: string;
    image?: string;
    tag?: string;
    logo: string;
  };
  posts: Array<any>;
};

const useStyles = makeStyles((theme) => ({
  media: {
    width: "100%",
    height: "100%",
    backgroundSize: "contain",
    backgroundPosition: "center",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "200px",
    padding: theme.spacing(2),
  },
}));

const SportsPage: NextPage<Props> = ({ posts }) => {
  const classes = useStyles();

  return (
    <Layout>
      <Container>
        <Box pb={10} />
        <Typography variant="h2">Janus IF</Typography>
        <Typography variant="body1">
          Fra en sped start som Janus FK i 2006, har foreningen vokst til å forene godt over hundre sporty og engasjerte
          studenter under én felles paraply, med et bredt spekter av idretter. Tilbudet blir stadig bredere, og ønsker
          og idéer til nye lag og idretter tas alltid imot med åpne armer!{" "}
        </Typography>
        <Box my={10}>
          <Grid container spacing={2}>
            {posts
              .filter((post) => post.frontmatter.tag == "idrett")
              .map(({ frontmatter: { title, description, logo }, slug }: Props) => (
                <Grid key={slug} item xs={4}>
                  <Card className={classes.card}>
                    <Grid container spacing={1}>
                      {logo ? (
                        <Grid item xs={6}>
                          <CardMedia className={classes.media} image={logo} title="Contemplative Reptile" />
                        </Grid>
                      ) : (
                        ""
                      )}
                      <Grid item xs={6}>
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" component="p">
                            {description}
                          </Typography>
                          <Link href={"./[slug]"} as={`./${slug}`}>
                            <Button component="a">Les mer</Button>
                          </Link>
                        </CardContent>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export async function getStaticProps() {
  const posts = getSortedPosts("organizations");

  return {
    props: {
      posts,
    },
  };
}

export default SportsPage;
