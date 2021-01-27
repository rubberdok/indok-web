import Hero from "@components/Hero";
import Layout from "@components/Layout";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";

const useStyles = makeStyles((theme) => ({
  title: {
    color: "white",
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

      <Container>
        <Box mt={15} position="relative" className={classes.title} height={400}>
          <Grid style={{ height: "100%" }} container>
            <Grid item xs={12}>
              <Box
                className={classes.titleImage}
                style={{
                  backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9)),
        url('img/gang.jpg')`,
                }}
              ></Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={1}></Grid>
            <Grid item xs={7}>
              <Box display="flex" top="0" alignItems="center" position="absolute" height="100%" zIndex="4">
                <Box width={650}>
                  <Typography variant="overline">Foreningen bak</Typography>
                  <Typography variant="h2">Et av de beste sosiale miljøene ved NTNU.</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              {/* <Box mr={5} display="flex" top="0" alignItems="center" position="absolute" height="100%" zIndex="4">
                <Paper>
                  <Box px={8} py={6}>
                    <Typography gutterBottom variant="body2">
                      Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse, NTNU er formaliseringen av
                      all foreningsaktivitet på Indøk under ett og samme tak.
                    </Typography>
                    <br />
                    <Link href="/events">
                      <Button variant="contained" endIcon={<NavigateNextIcon />}>
                        Se kalenderen
                      </Button>
                    </Link>
                  </Box>
                </Paper>
              </Box> */}
            </Grid>
          </Grid>
        </Box>

        <Box pt={5}>
          <Grid container spacing={5}>
            <Grid item xs={12} md={3}>
              <Box height="100%" display="flex" alignItems="center">
                <Typography variant="h3">
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
      </Container>

      <Box mt={12} position="relative">
        <Container>
          <Box mb={5}>
            <Grid alignItems="stretch" container>
              <Grid item xs={12} md={6}>
                <Paper>
                  <Box p={10}>
                    <Typography variant="overline">Hyttestyret</Typography>
                    <Typography gutterBottom variant="h3">
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
                      <Button variant="contained" endIcon={<NavigateNextIcon />}>
                        Les mer
                      </Button>
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
                <Box p={10}>
                  <Typography variant="overline">Linjens historie</Typography>
                  <Typography gutterBottom variant="h3">
                    INDØK siden 1986
                  </Typography>
                  <br />
                  <Typography gutterBottom variant="body2">
                    Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse, NTNU er formaliseringen av
                    all foreningsaktivitet på Indøk under ett og samme tak. På den måten kan vi si at Foreningen har
                    eksistert så lenge studentfrivilligheten på Indøk har det.{" "}
                  </Typography>
                  <br />

                  <Button variant="contained" endIcon={<NavigateNextIcon />}>
                    Les mer
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default IndexPage;
