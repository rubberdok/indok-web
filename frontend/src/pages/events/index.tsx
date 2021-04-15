import Layout from "@components/Layout";
import { Box, Container, makeStyles, Typography, useTheme } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";
import AllEvents from "../../components/pages/events/AllEvents/index";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4, 0),
  },
}));

const Events: NextPage = () => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Layout>
      <Box width="100%" py={10} bgcolor={theme.palette.background.paper}>
        <Container>
          <Typography variant="h1">Arrangementer</Typography>
        </Container>
      </Box>
      <Container className={classes.container}>
        <AllEvents />
      </Container>
    </Layout>
  );
};

export default Events;
