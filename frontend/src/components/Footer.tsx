import { Box, makeStyles, Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import React from "react";

const useStyles = makeStyles((theme) => ({
  logo: {
    width: theme.spacing(15),
    marginBottom: theme.spacing(2),
  },
  nth: {
    opacity: 0.035,
    width: "500px",
    right: "-120px",
    bottom: "-120px",
    position: "absolute",
    zIndex: -100,
  },
  credits: {
    padding: "30px 0",
    color: "#fff",
    background: "#000",
  },
}));

const Footer: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <Box pt={10} pb={5}>
        {/* <Container>
          <Box position="relative" py={10}>
            <img className={classes.nth} src="./nth.png" />
            <Grid container>
              <Grid item xs={1}>
                <List dense disablePadding>
                  <ListItem>
                    <ListItemText>
                      <Typography variant="caption"><Link href="#">Home</Link></Typography>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Typography variant="caption"><Link href="#">Home</Link></Typography>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Typography variant="caption"><Link href="#">Home</Link></Typography>
                    </ListItemText>
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={1}>
                <List dense disablePadding>
                  <ListItem>
                    <ListItemText>
                      <Typography variant="caption"><Link href="#">Home</Link></Typography>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Typography variant="caption"><Link href="#">Home</Link></Typography>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Typography variant="caption"><Link href="#">Home</Link></Typography>
                    </ListItemText>
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs>

              </Grid>
              <Grid item xs={2}>
                <Box>
                  <img className={classes.logo} src={"/logo.svg"} alt="INDØK Hovedstyre" />
                  <Typography variant="caption">Hjemmesiden for studentfrivilligheten ved Industriell Økonomi og Teknologiledelse, NTNU</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

        </Container> */}
      </Box>
      <Box className={classes.credits}>
        <Container>
          <Typography variant="caption">Laget av RubberDøk, Hovedstyret på Indøks webkomité</Typography>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
