import { Box, Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React from "react";
import Sidebar from "./Sidebar";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Container>
    <Box pt={8}>
      <Grid container spacing={5}>
        <Grid item xs={3}>
          <Sidebar />
        </Grid>
        <Grid item xs={9}>
          {children}
        </Grid>
      </Grid>
    </Box>
  </Container>
);

export default Wrapper;
