import { Box, Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React from "react";
import Sidebar from "./Sidebar";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Container>
    <Box pt={8} pb={16}>
      <Grid container direction="row" justify="center" spacing={5}>
        <Grid item xs={8}>
          {children}
        </Grid>
        <Grid item xs={4}>
          <Sidebar />
        </Grid>
      </Grid>
    </Box>
  </Container>
);

export default Wrapper;
