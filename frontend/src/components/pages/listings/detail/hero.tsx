import { Box, makeStyles, Grid, Card, CardContent, Typography, Button, CardActions, CardMedia } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  root : {
    height: "40vh",
    marginTop: "20vh"
  },
  hero: {
    position: "absolute",
    height: "40vh",
    width: "100%",
    zIndex: -1
  }

}));

interface HeroProps {
  img: String,
  title: String,
  subtitle1?: String,
  subtitle2?: String,
  buttonText?: String,
  url?: String,
}

const Hero: React.FC<HeroProps> = ({ img, title, subtitle1, subtitle2, buttonText, url }) => {
  const classes = useStyles();
  const bgImg = {
    backgroundImage: `linear-gradient(to top, rgb(2 28 28 / 60%), rgb(1 12 12 / 93%)), url(/${img})`,
    backgroundRepeat: `no-repeat`,
    backgroundSize: `cover`,
    height: `100%`,
  }
  return (
    <>
    <Box className={classes.hero}>
      <Box style={bgImg} />
    </Box>
    <Box >
      <Grid container direction="column" className={classes.root} justify="center" alignItems="center">
        <Grid container direction="row" alignItems="center" justify="center">
          <Grid item xs={5}>
            <Card variant="outlined">
              <CardContent>
                <Grid container direction="column" alignItems="center">
                  <Grid item>
                    <Typography variant="h5" component="h1">{title}</Typography>
                  </Grid>
                  {subtitle1 && (
                    <Grid item>
                      <Typography variant="subtitle1" component="h2">{subtitle1}</Typography>
                    </Grid>
                  )}
                  {subtitle2 && (
                    <Grid item>
                      <Typography variant="subtitle2" component="h3">{subtitle2}</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
              {buttonText && (
                <CardActions>
                  <Grid container direction="row" alignItems="center" justify="center">
                    <Grid item>
                      <Button variant="contained" color="primary">{buttonText}</Button>
                    </Grid>
                  </Grid>
                </CardActions>
              )}
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Box>
    </>
  )
};

export default Hero;