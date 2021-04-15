import Layout from "@components/Layout";
import { Typography, Grid, Box } from "@material-ui/core";
import { NextPage } from "next";
const BookingAdminPage: NextPage = () => {
  return (
    <Layout>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Box p={3}>
            <Typography variant="h1" align="center">
              Booking adminside
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default BookingAdminPage;
