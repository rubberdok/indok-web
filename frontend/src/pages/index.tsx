import Hero from "@components/Hero";
import Layout from "@components/Layout";
import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { NextPage } from "next";
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
    <Layout>
      <Hero />
      <Parallax
        bgImageStyle={{ zIndex: -1 }}
        className={classes.title}
        bgImage="img/gang.jpg"
        bgImageAlt="the cat"
        strength={200}
      >
        <Box m="0 auto" maxWidth="90vw" height={600}>
          <Box display="flex" top="0" alignItems="center" position="absolute" height="100%" zIndex="4">
            <Box width={650}>
              <Typography variant="overline">Foreningen bak</Typography>
              <Typography variant="h3">
                Et av de beste <br />
                sosiale miljøene ved NTNU.
              </Typography>
              <br />
              <Button color="inherit" size="large" startIcon={<NavigateNextIcon />}>
                Utforsk kalenderen
              </Button>
            </Box>
          </Box>
        </Box>
      </Parallax>
      <Parallax
        bgImageStyle={{ zIndex: -1 }}
        className={classes.title}
        bgImage="img/hytte.jpg"
        bgImageAlt="the cat"
        strength={200}
      >
        <Box m="0 auto" maxWidth="90vw" height={600}>
          <Box display="flex" top="0" alignItems="center" position="absolute" height="100%" zIndex="4">
            <Box width={650}>
              <Typography variant="overline">Hyttestyret</Typography>
              <Typography variant="h3">Book en av hyttene våre til rimlig pris</Typography>
              <br />
              <Button color="inherit" size="large" startIcon={<NavigateNextIcon />}>
                Book hytte
              </Button>
            </Box>
          </Box>
        </Box>
      </Parallax>
      <Parallax
        bgImageStyle={{ zIndex: -1 }}
        className={classes.title}
        bgImage="img/hero.jpg"
        bgImageAlt="the cat"
        strength={200}
      >
        <Box m="0 auto" maxWidth="90vw" height={600}>
          <Box display="flex" top="0" alignItems="center" position="absolute" height="100%" zIndex="4">
            <Box width={650}>
              <Typography variant="overline">Historien vår</Typography>
              <Typography variant="h3">Indøk siden 1986</Typography>
              <br />
              <Button color="inherit" size="large" startIcon={<NavigateNextIcon />}>
                Les om historien
              </Button>
            </Box>
          </Box>
        </Box>
      </Parallax>
      {/* <Container>


        <Box pt={5}>
          <Grid container spacing={5}>
            <Grid item xs={12} md={3}>
              <Box height="100%" display="flex" alignItems="center">
                <Typography variant="h4">
                  Kommende <br />
                  arrangementer
                </Typography>
              </Box>
            </Grid>
            <Grid item xs>
              <Card className={classes.card}>
                <CardMedia component="img" src="/img/afterski.jpg" className={classes.cardMedia} />
                <div className={classes.cardContent}>
                  <CardContent>
                    <Typography gutterBottom variant="h4" component="h2">
                      Afterski i Bymarka
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      September 17.
                    </Typography>
                  </CardContent>
                </div>
              </Card>
            </Grid>
            <Grid item xs>
              <Card className={classes.card}>
                <CardMedia component="img" src="/img/borsfest.jpg" className={classes.cardMedia} />
                <div className={classes.cardContent}>
                  <CardContent>
                    <Typography gutterBottom variant="h4" component="h2">
                      Woodøk i kjent stil
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      November 32.
                    </Typography>
                  </CardContent>
                </div>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container> */}

      {/* <Box position="relative">
        <Box>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Paper>
                <Box pl="5vw" py={10} pr={10}>
                  <Typography variant="overline">Hyttestyret</Typography>
                  <Typography gutterBottom variant="h4">
                    Book en av hyttene våre til rimlig pris
                    </Typography>
                  <br />
                  <Typography gutterBottom variant="body2">
                    Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse, NTNU er formaliseringen av
                    all foreningsaktivitet på Indøk under ett og samme tak. På den måten kan vi si at Foreningen har
                      eksistert så lenge studentfrivilligheten på Indøk har det.{" "}
                  </Typography>
                  <br />
                  <Link href="/cabins">
                    <Button color="primary" size="large" startIcon={<NavigateNextIcon />}>Book hytte</Button>
                  </Link>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <img className={classes.articleImg} alt="" src="/img/hytte.jpg" />
            </Grid>
          </Grid>
        </Box>
        <Grid alignItems="stretch" container>
          <Grid item xs={12} md={6}>
            <img className={classes.articleImg} alt="" src="/img/gang.jpg" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper>
              <Box pr="5vw" py={10} pl={10}>
                <Typography variant="overline">Linjens historie</Typography>
                <Typography gutterBottom variant="h4">
                  INDØK siden 1986
                  </Typography>
                <br />
                <Typography gutterBottom variant="body2">
                  Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse, NTNU er formaliseringen av
                  all foreningsaktivitet på Indøk under ett og samme tak. På den måten kan vi si at Foreningen har
                    eksistert så lenge studentfrivilligheten på Indøk har det.{" "}
                </Typography>
                <br />

                <Button color="primary" size="large" startIcon={<NavigateNextIcon />}>Les om historien</Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box> */}
    </Layout>
  );
};

export default IndexPage;
