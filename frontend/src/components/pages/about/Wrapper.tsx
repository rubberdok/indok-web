import { Box, Container, Paper } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React from "react";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Container>
    <Paper>
      <Box pt={8} pb={16}>
        <Grid container spacing={5}>
          <Grid item xs={2}>
            {/* <Sidebar /> */}
          </Grid>
          <Grid item xs={8}>
            {children}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  </Container>
);

export default Wrapper;
