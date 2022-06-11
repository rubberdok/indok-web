import {
  Box,
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Image from "next/image";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.up("md")]: {
      maxWidth: "90vw",
    },
  },
  card: {
    marginTop: -80,
    marginBottom: -80,
    padding: "56px 64px",
    [theme.breakpoints.down("sm")]: {
      padding: "64px 24px",
      textAlign: "center",
    },
    width: "100%",
    zIndex: 1000,
    backgroundColor: theme.palette.primary.dark,
  },
  cardGrid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const LandingAnnouncement: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container style={{ position: "relative", ...(isMobile && { padding: 0 }) }}>
      <Paper className={classes.card}>
        <Grid container spacing={isMobile ? 4 : 10} className={classes.cardGrid}>
          <Grid item md={2}>
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
                Hold av <b>2. - 10. mars</b> for tidenes jubileumsuke!
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <div>
              <Link href="/events" passHref>
                <Button variant="contained" size="large" fullWidth={isMobile} style={{ backgroundColor: "#a3bbac" }}>
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
