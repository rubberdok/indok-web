import Layout from "@components/Layout";
import BookingSemesterPicker from "@components/pages/cabins/Admin/BookingSemesterPicker";
import { Box, Button, Container, Grid, Paper, Typography, useMediaQuery } from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";
import theme from "@styles/theme";
import router from "next/router";
import React from "react";

const SettingsPage = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Layout>
      <Container>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Box p={3}>
              <Typography variant={isMobile ? "h3" : "h1"} align="center">
                Innstillinger
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Button startIcon={<ArrowBackIos />} onClick={() => router.back()}>
              Gå tilbake
            </Button>
          </Grid>

          <Grid item>
            <Box marginBottom={5}>
              <Paper>
                <Box p={4}>
                  <Typography variant="h5">Velg start og slutt-dato for booking for høst- og vårsemestrene</Typography>
                  <Typography>Det vil kun være mulig for brukere å søke om bookinger i disse periodene.</Typography>
                </Box>
                <Box p={4}>
                  <BookingSemesterPicker />
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default SettingsPage;
