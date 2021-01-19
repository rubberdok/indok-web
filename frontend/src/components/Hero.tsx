import { Box, Button, Card, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import React from "react";

const useStyles = makeStyles((theme) => ({
  heroCard: {
    width: theme.spacing(80),
    marginTop: "80px",
  },
  heroImage: {
    width: "100%",
    height: "calc(100vh - 80px)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
}));

interface HeroProps {
  classes?: any;
}

const Hero: React.FC<HeroProps> = () => {
  const classes = useStyles();

  return (
    <Box height="calc(100vh - 80px)">
      <Grid container justify="flex-end">
        <Grid item xs={12} md={10}>
          <Box className={classes.heroImage} style={{ backgroundImage: `url("/img/hero.jpg")` }}></Box>
        </Grid>
      </Grid>
      <Container>
        <Box display="flex" top="0" alignItems="center" position="absolute" height="100%" zIndex="modal">
          <Card className={classes.heroCard}>
            <Box px={8} py={6}>
              <Typography variant="overline">Foreningen for studentene ved</Typography>
              <Typography variant="h1">Industriell Økonomi og Teknologiledelse</Typography>
            </Box>

            <Grid container justify="flex-end">
              <Button color="primary" variant="contained" endIcon={<NavigateNextIcon />}>
                Mer om foreningen
              </Button>
            </Grid>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
