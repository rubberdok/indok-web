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
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
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
    width: "200px",
    minHeight: "200px",
    backgroundSize: "contain",
    backgroundPosition: "center",
  },
  card: {
    display: "flex",
    alignItems: "center",
    height: "450px",
  },
}));

const OrganizationsPage: NextPage<Props> = ({ posts }) => {
  const classes = useStyles();

  return (
    <Layout>
      <Container>
        <Box pb={10} />
        <Typography variant="h2" gutterBottom>
          Hovedstyret
        </Typography>
        <Typography variant="body" gutterBottom>
          Hovedstyret (HS) er styret i Foreningen for studentene ved Industriell økonomi og teknologiledelse, NTNU.
          Hovedstyret består av et valgt lederpar, instituttilittsvalgt ved IØT, samt leder for hver av linjeforeningene
          Janus, Bindeleddet, ESTIEM, Hyttestyret, Janus IF og Indøk Kultur. Hovedstyrets fremste oppgave er å sørge for
          god kommunikasjon og samarbeid mellom de ulike studentinitiativene, og forvalte og disponere Indøks midler på
          en forsvarlig måte. Hovedstyret er ansvarlig for å forberede og avholde generalforsamling for studentene ved
          Indøk. Generalforsamlingen er Foreningens øverste organ og er studentenes mulighet til å direkte påvirke
          budsjetter og avgjørelser som blir fattet på linjen.
        </Typography>

        <Box my={10}>
          <Grid container spacing={5}>
            {posts.map(({ frontmatter: { title, description, logo }, slug }: Props) => (
              <Grid key={slug} item xs={12} sm={6} md={4}>
                <Card>
                  <CardActionArea className={classes.card}>
                    {logo ? <CardMedia className={classes.media} image={logo} /> : ""}
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        {"Lars Lien Ankile"}
                      </Typography>
                      <Typography variant="body2">{"Leder"}</Typography>
                    </CardContent>
                  </CardActionArea>
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

export default OrganizationsPage;
