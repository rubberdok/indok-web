import { Box, Grid, Hidden, makeStyles, Typography, useTheme } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  anniversary: {
    transition: "0.7s all ease",
    background: "url('/static/anniversary/anniversary_logo_black.svg')",
    backgroundSize: "contain",
    backgroundPosition: "right",
    backgroundRepeat: "no-repeat",
    opacity: 0.05,
    height: "120%",
    marginRight: "10%",
    right: 0,
    top: 0,
  },
}));

type Props = {
  children: string;
};

const Title: React.FC<Props> = ({ children }) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Box
      width="100%"
      pt={10}
      pb={7}
      mb={4}
      position="relative"
      bgcolor={theme.palette.background.paper}
      style={{ overflow: "hidden" }}
    >
      <Grid container direction="row" justifyContent="center" alignItems="center">
        <Grid container item direction="column" alignItems="flex-start" justifyContent="center" md={8} xs={10}>
          <Grid item>
            <Typography variant="h1" gutterBottom>
              {children}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Hidden smDown>
        <Box className={classes.anniversary} position="absolute" width="100vw" height="100vh" />
      </Hidden>
    </Box>
  );
};

export default Title;
