import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { QUERY_ALL_BOOKINGS } from "@graphql/cabins/queries";
import { Booking } from "@interfaces/cabins";
import { Typography, Grid, Box, List, ListItem } from "@material-ui/core";
import dayjs from "dayjs";
import { NextPage } from "next";
const BookingAdminPage: NextPage = () => {
  const allBookingsQuery = useQuery<{
    allBookings: Booking[];
  }>(QUERY_ALL_BOOKINGS, { variables: { after: dayjs().format("YYYY-MM-DD") } });
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
        <Grid item>
          <List>
            {allBookingsQuery.data?.allBookings.map((booking: Booking) => (
              <ListItem key={booking.id}>{booking.firstname}</ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default BookingAdminPage;
