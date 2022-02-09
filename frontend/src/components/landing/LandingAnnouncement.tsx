import { Box, Button, Container, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import Image from "next/image";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.up("md")]: {
      maxWidth: "90vw",
    },
  },
  heroCard: {
    marginTop: -80,
    marginBottom: -80,
    padding: "56px 64px",
    width: "100%",
    zIndex: 1000,
    backgroundColor: "#0b2c1e",
  },
}));

const LandingAnnouncement: React.FC = () => {
  const classes = useStyles();

  return (
    <Container style={{ position: "relative" }}>
      <Paper className={classes.heroCard}>
        <Grid container spacing={10} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Grid item xs={2}>
            <Box width={150} height={150} position="relative">
              <Image alt="jubileum logo" layout="fill" src="/static/anniversary/anniversary_logo.svg" />
            </Box>
          </Grid>
          <Grid item>
            <Box display="flex" flexDirection="column" style={{ color: "#fff" }}>
              <Typography variant="h3" style={{ marginBottom: 10 }}>
                Indøk har bursdag!
              </Typography>
              <Typography variant="subtitle1" style={{ color: "#a3bbac" }}>
                Hold av <b>2. - 10. mars</b> for en tidenes jubileumsuke.
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <div>
              <Link href="/events" passHref>
                <Button variant="contained" size="large" style={{ backgroundColor: "#a3bbac" }}>
                  Se arrangementer
                </Button>
              </Link>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LandingAnnouncement;
