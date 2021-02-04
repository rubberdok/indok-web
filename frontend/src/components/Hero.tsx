import { Box, Button, Container, Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Link from "next/link";
import React from "react";

const useStyles = makeStyles(() => ({
  hero: {
    color: "white",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  heroCard: {
    marginTop: -70,
    padding: "32px 48px",
  },
}));

const Hero: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.hero} height="calc(100vh - 130px)">
      <Box
        className={classes.heroImage}
        style={{
          backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.95)),
        url('img/hero.jpg')`,
        }}
      ></Box>
      <Container>
        <Box display="flex" top="0" alignItems="center" position="absolute" height="90vh" zIndex="4">
          <Box width={800}>
            <Typography variant="overline">Foreningen for studentene ved</Typography>
            <Typography variant="h1">Industriell Økonomi og Teknologiledelse</Typography>
          </Box>
        </Box>
        <Grid justify="center" container>
          <Grid item xs={10}>
            <Paper className={classes.heroCard}>
              <Box display="flex" alignItems="center">
                <Box flexGrow={1}>
                  <Typography variant="h6">Les de siste nyhetene fra Hovedstyret</Typography>
                </Box>
                <Link href="/about">
                  <Button variant="contained" endIcon={<NavigateNextIcon />}>
                    Klikk her
                  </Button>
                </Link>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
