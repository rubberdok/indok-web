import Hero from "@components/Hero";
import Layout from "@components/Layout";
import Content from "@components/ui/Content";
import ImageCard from "@components/ui/ImageCard";
import { Heading, Paragraph, SubHeading } from "@components/ui/Typography";
import { Typography } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Composition } from "atomic-layout";
import { NextPage } from "next";

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

const hero = {
  title: "Title of a longer featured blog post",
  description:
    "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
  image: "https://source.unsplash.com/random",
  imgText: "main image description",
  linkText: "Continue reading…",
};

const IndexPage: NextPage = () => (
  <Layout>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">INDØK</Typography>
      </Toolbar>
    </AppBar>

    <Hero post={hero} />

    <Content>
      <Box my={20}>
        <Grid container justify="center" alignItems="center" spacing={8}>
          <Grid item xs={5}>
            <Typography align="center" variant="h3">
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
      <Composition alignItems="center" areas={areasTablet} areasLg={areasLarge} gap={60} gapRow={20}>
        {(Areas) => (
          <>
            <Areas.Items>
              <SubHeading>Kommende Eventer</SubHeading>
              <Composition
                templateCols="auto"
                templateColsMd="auto auto auto auto"
                templateColsLg="auto"
                gap={10}
                gapLg={15}
              >
                {data.map((item) => (
                  <ImageCard key={item.id} title={item.title} subtitle={item.subtitle} imageUrl={item.imageUrl} />
                ))}
              </Composition>
            </Areas.Items>
            <Areas.Content>
              <SubHeading>Arrangementer</SubHeading>
              <Heading>Hva skjer nå?</Heading>
              <Paragraph>
                Hovedstyret (HS) er styret i Foreningen for studentene ved Industriell økonomi og teknologiledelse,
                NTNU. Hovedstyret består av et valgt lederpar, instituttilittsvalgt ved IØT, samt leder for hver av
                linjeforeningene Janus, Bindeleddet, ESTIEM, Hyttestyret, Janus IF og Indøk Kultur. Hovedstyrets fremste
                oppgave er å sørge for god kommunikasjon og samarbeid mellom de ulike studentinitiativene, og forvalte
                og disponere Indøks midler på en forsvarlig måte. Hovedstyret er ansvarlig for å forberede og avholde
                generalforsamling for studentene ved Indøk. Generalforsamlingen er Foreningens øverste organ og er
                studentenes mulighet til å direkte påvirke budsjetter og avgjørelser som blir fattet på linjen.
              </Paragraph>
            </Areas.Content>
            <Areas.Actions>
              <Button color="primary" variant="contained" endIcon={<NavigateNextIcon />}>
                Se kalenderen
              </Button>
            </Areas.Actions>
          </>
        )}
      </Composition>
      <br />
      <br />
      <br />
      <br />
    </Content>
  </Layout>
);

export default IndexPage;
