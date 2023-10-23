import { Container, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";

import { BookNow } from "./BookNow";

export const CabinsInfoSection: React.FC = () => {
  return (
    <Container>
      <Grid container direction="row-reverse" justifyContent="space-between" alignItems="stretch" spacing={8} mb={4}>
        <Grid container item xs={12} md={6}>
          <Grid item xs={12}>
            <BookNow />
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={12}
          md={6}
          sx={{
            textAlign: "left",
          }}
          direction="column"
        >
          <Grid container spacing={4} justifyContent="space-between">
            <Image alt="" src="/img/undraw_off_road.svg" width={600} height={400} />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
