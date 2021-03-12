import Layout from "@components/Layout";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  makeStyles,
  Typography,
} from "@material-ui/core";
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

const OrganizationsPage: NextPage<Props> = ({ posts }) => {
  const classes = useStyles();

  return (
    <Layout>
      <Container>
        <Box pb={10} />
        <Typography variant="h2">Organisasjonene under Hovedstyret</Typography>
        <Box my={10}>
          <Grid container spacing={2}>
            {posts.map(({ frontmatter: { title, description, logo }, slug }: Props) => (
              <Grid key={slug} item xs={12} sm={6} md={4}>
                <Card>
                  <Link href={"./organizations/[slug]"} as={`./organizations/${slug}`} passHref>
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

export async function getStaticProps() {
  const posts = getSortedPosts("organizations");

  return {
    props: {
      posts,
    },
  };
}

export default OrganizationsPage;
