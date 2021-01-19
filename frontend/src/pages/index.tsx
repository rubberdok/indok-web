import Hero from "@components/Hero";
import Layout from "@components/Layout";
import Content from "@components/ui/Content";
import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { NextPage } from "next";
import { Container } from "next/app";

const data = [
  {
    id: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
    imageUrl: "./img/borsfest.jpg",
    title: "Børsfest: Cash is king",
    subtitle: "Om 6 dager",
  },
  {
    id: "ad782ecdac770fc6eb9a62e44f90873fb97fb26b",
    imageUrl: "./img/woodok.jpg",
    title: "Woodøk i kjent stil",
    subtitle: "20. November",
  },
  {
    id: "b802f384302cb24fbab0a44997e820bf2e8507bb",
    imageUrl: "./img/afterski.jpg",
    title: "Afterski i Bymarka",
    subtitle: "25. November",
  },
  {
    id: "b802f384302cb24fbab0a44994e820bf2e8507bb",
    imageUrl: "./img/afterski.jpg",
    title: "Afterski i Bymarka",
    subtitle: "25. November",
  },
];

const areasTablet = `
  content
  items
  actions
`;

const areasLarge = `
  content items
  actions items
`;

const IndexPage: NextPage = () => (
  <Layout>
    <Hero />

    <Content>
      <Box my={20}>
        <Grid container justify="space-evenly" alignItems="center" spacing={0}>
          <Grid item xs={4}>
            <Typography gutterBottom align="center" variant="h1">
              Foreningen bak et av de beste sosiale miljøene på NTNU.
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="subtitle1">
              Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse, NTNU er formaliseringen av all
              foreningsaktivitet på Indøk under ett og samme tak. På den måten kan vi si at Foreningen har eksistert så
              lenge studentfrivilligheten på Indøk har det. Allerede på det første Indøk-kullet i 86´{" "}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Content>

    <Container>
      <Grid container>
        <Grid item xs={4}>
          <Typography variant="h3" align="center">
            Kommende arrengementer
          </Typography>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    </Container>
  </Layout>
);

export default IndexPage;
