import { useMutation, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { QUERY_ADMIN_ALL_BOOKINGS } from "@graphql/cabins/queries";
import { Booking } from "@interfaces/cabins";
import CheckIcon from "@material-ui/icons/Check";
import {
  Typography,
  Grid,
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import { toStringChosenCabins } from "@utils/cabins";
import dayjs from "dayjs";
import { NextPage } from "next";
import { CONFIRM_BOOKING } from "@graphql/cabins/mutations";
import { useState } from "react";
import { useRouter } from "next/router";

const BookingAdminPage: NextPage = () => {
  const { data, error } = useQuery<{
    adminAllBookings: Booking[];
  }>(QUERY_ADMIN_ALL_BOOKINGS, { variables: { after: dayjs().format("YYYY-MM-DD") } });
  const [confirmBooking] = useMutation(CONFIRM_BOOKING, { refetchQueries: [{ query: QUERY_ADMIN_ALL_BOOKINGS }] });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const handleDialogClose = () => router.push("/");
  return (
    <Layout>
      <Snackbar
        open={openSnackbar}
        message="Booking bekreftet. Bekreftelsesmail sendt."
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      />
      <Dialog open={error != undefined} onClose={handleDialogClose}>
        <DialogTitle>{`Det har oppstått en feilmelding: ${error?.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>{error?.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Box p={3}>
            <Typography variant="h1" align="center">
              Booking adminside
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box m={5}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Bookings</TableCell>
                    <TableCell align="right">Epost</TableCell>
                    <TableCell align="right">Telefonnummer</TableCell>
                    <TableCell align="right">Innsjekk</TableCell>
                    <TableCell align="right">Utsjekk</TableCell>
                    <TableCell align="right">Hytte</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Handlinger</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.adminAllBookings.map((booking: Booking) => (
                    <TableRow key={booking.id}>
                      <TableCell component="th" scope="row">
                        {booking.firstname + " " + booking.lastname}
                      </TableCell>
                      <TableCell align="right">{booking.receiverEmail}</TableCell>
                      <TableCell align="right">{booking.phone}</TableCell>
                      <TableCell align="right">{booking.checkIn}</TableCell>
                      <TableCell align="right">{booking.checkOut}</TableCell>
                      <TableCell align="right">{toStringChosenCabins(booking.cabins)}</TableCell>
                      <TableCell align="right">{booking.isTentative ? "Ikke godkjent" : "Godkjent"}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          disabled={!booking.isTentative}
                          onClick={() => {
                            confirmBooking({ variables: { id: booking.id } });
                            setOpenSnackbar(true);
                          }}
                        >
                          <CheckIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default BookingAdminPage;
