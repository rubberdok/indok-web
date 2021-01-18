import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  hero: {
    position: "relative",
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,.3)",
    overflow: "hidden",
  },
  heroImage: {
    height: theme.spacing(80),
    width: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  heroContent: {
    position: "relative",
    padding: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
}));

interface HeroProps {
  post?: any;
  classes?: any;
}

const Hero: React.FC<HeroProps> = (props) => {
  const classes = useStyles();
  const { post } = props;

  return (
    <Grid container justify="flex-end">
      <Grid item md={10}>
        <Box className={classes.heroImage} style={{ backgroundImage: `url(${post.image})` }}></Box>
      </Grid>
    </Grid>
  );
};

export default Hero;
