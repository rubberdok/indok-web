import Hero from "@components/Hero";
import Layout from "@components/Layout";
import { Box, Button, Container, makeStyles, Typography } from "@material-ui/core";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Parallax } from "react-parallax";

const useStyles = makeStyles((theme) => ({
  title: {
    color: "white",

    ["&::before"]: {
      background: "linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9))",
      content: "''",
      display: "block",
      height: "100%",
      position: "absolute",
      width: "100%",
    },
  },
  titleImage: {
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  card: {
    display: "flex",
    height: theme.spacing(20),
  },
  cardContent: {
    flex: 1,
    padding: theme.spacing(2),
  },
  cardMedia: {
    width: theme.spacing(25),
  },
  articleImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

const IndexPage: NextPage = () => {
  const classes = useStyles();

  return (
    <Layout title={"Foreningen for Industriell Økonomi og Teknologiledelse"}>
      <Head>
        <meta
          name="description"
          content="Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse er den øverste instansen for all studentfrivillighet på masterstudiet Indøk ved NTNU. Foreningen drives av over 200 ivrige sjeler og over 20 ulike organisasjoner, hvor alt fra veldedighet og ølbrygging til fadderuker og case-trening står på agendaen."
        />
        <meta property="og:image" content="img/gang.jpg" key="image" />
      </Head>
      <Hero />
      <Parallax
        bgImageStyle={{ zIndex: -1, objectFit: "cover", objectPosition: "50% -19vh" }}
        className={classes.title}
        bgImage="img/gang.jpg"
        bgImageAlt="bilde av indøkstudenter"
        strength={200}
        renderLayer={(percentage) => (
          <div
            style={{
              background: "rgba(2, 42, 42, " + (1 - percentage) + ")",
              height: "100%",
              width: "100%",
              position: "absolute",
            }}
          />
        )}
      >
        <Container>
          <Box height={600}>
            <Box display="flex" top="0" alignItems="center" position="absolute" height="100%" zIndex="4">
              <Box maxWidth={650}>
                <Typography variant="overline">Foreningen bak</Typography>
                <Typography variant="h2">Et fantastisk studentmiljø.</Typography>
                <br />
                <Link href="./events" passHref>
                  <Button color="inherit" variant="outlined">
                    Se kommende arrangementer
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </Container>
      </Parallax>
    </Layout>
  );
};

export default IndexPage;
