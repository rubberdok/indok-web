import Layout from "@components/Layout";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
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

const useStyles = makeStyles(() => ({
  media: {
    width: "100px",
    minHeight: "100px",
    backgroundSize: "contain",
    backgroundPosition: "center",
  },
  card: {
    display: "flex",
    alignItems: "center",
    height: "180px",
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
        <br />
        <Link href="./" passHref>
          <Button color="inherit" size="large" startIcon={<NavigateBeforeIcon />}>
            Oversikt
          </Button>
        </Link>
        <Box my={10}>
          <Grid container spacing={2}>
            {posts
              .filter((post) => post.frontmatter.tag == "idrett")
              .map(({ frontmatter: { title, description, logo }, slug }: Props) => (
                <Grid key={slug} item xs={12} sm={6} md={4}>
                  <Card>
                    <Link href={"./[slug]"} as={`./${slug}`} passHref>
                      <CardActionArea className={classes.card}>
                        {logo ? <CardMedia className={classes.media} image={logo} /> : ""}
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {title}
                          </Typography>
                          <Typography gutterBottom variant="body2">
                            {description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Link>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const posts = getSortedPosts("organizations");

  return {
    props: {
      posts,
    },
  };
};

export default SportsPage;
