import { useMutation, useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import { QUERY_ADMIN_ALL_BOOKINGS } from "@graphql/cabins/queries";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import SettingsIcon from "@material-ui/icons/Settings";
import {
  Typography,
  Grid,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Snackbar,
  Button,
  Tooltip,
  Container,
  useMediaQuery,
  makeStyles,
  TableContainer,
} from "@material-ui/core";
import { getDecisionEmailProps, toStringChosenCabins } from "@utils/cabins";
import dayjs from "dayjs";
import { NextPage } from "next";
import PermissionRequired from "@components/permissions/PermissionRequired";
import Alert from "@material-ui/lab/Alert";
import { BookingFromQuery } from "@interfaces/cabins";
import { CONFIRM_BOOKING, SEND_EMAIL } from "@graphql/cabins/mutations";
import theme from "@styles/theme";
import router from "next/router";
import React, { useState } from "react";
import DeleteBookingDialog from "@components/pages/cabins/Admin/DeleteBookingDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflowX: "auto",
    marginBottom: theme.spacing(4),
  },
}));

/*
Page for booking admininistration showing all upcoming bookings and buttons for actions on these bookings.
*/
const AdminPage: NextPage = () => {
  const { data, refetch } = useQuery<{
    adminAllBookings: BookingFromQuery[];
  }>(QUERY_ADMIN_ALL_BOOKINGS, { variables: { after: dayjs().subtract(1, "day").format("YYYY-MM-DD") } });
  const [confirmBooking] = useMutation(CONFIRM_BOOKING, { refetchQueries: [{ query: QUERY_ADMIN_ALL_BOOKINGS }] });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [bookingToBeDeleted, setBookingToBeDeleted] = useState<BookingFromQuery | undefined>();
  const [sendEmail] = useMutation(SEND_EMAIL);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();

  return (
    <Layout>
      <Container>
        <PermissionRequired permission="cabins.manage_booking">
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
            <Alert severity="success">{snackbarMessage}</Alert>
          </Snackbar>
          <DeleteBookingDialog
            bookingToBeDeleted={bookingToBeDeleted}
            setBookingToBeDeleted={setBookingToBeDeleted}
            setSnackbarMessage={setSnackbarMessage}
            setOpenSnackbar={setOpenSnackbar}
            refetch={refetch}
          />
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Box p={3}>
                <Typography variant={isMobile ? "h3" : "h1"} align="center">
                  Booking adminside
                </Typography>
                <Button startIcon={<SettingsIcon />} onClick={() => router.push("admin/settings")}>
                  Innstillinger
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box className={classes.root} marginBottom={5}>
            <TableContainer component={Paper}>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Navn</TableCell>
                    <TableCell>Epost</TableCell>
                    <TableCell>Telefonnummer</TableCell>
                    <TableCell>Innsjekk</TableCell>
                    <TableCell>Utsjekk</TableCell>
                    <TableCell>Hytte</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Handlinger</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.adminAllBookings.map((booking: BookingFromQuery) => (
                    <TableRow key={booking.id}>
                      <TableCell>{`${booking.firstName} ${booking.lastName}`}</TableCell>
                      <TableCell>{booking.receiverEmail}</TableCell>
                      <TableCell>{booking.phone}</TableCell>
                      <TableCell>{booking.checkIn}</TableCell>
                      <TableCell>{booking.checkOut}</TableCell>
                      <TableCell>{toStringChosenCabins(booking.cabins)}</TableCell>
                      <TableCell>{booking.isTentative ? "Ikke godkjent" : "Godkjent"}</TableCell>
                      <TableCell>
                        <Tooltip title="Godkjenn">
                          <Box display="inline">
                            <IconButton
                              disabled={!booking.isTentative}
                              onClick={() => {
                                confirmBooking({ variables: { id: booking.id } }).then(() => {
                                  setSnackbarMessage(
                                    `Booking bekreftet. Bekreftelsesmail er sendt til ${booking.receiverEmail}.`
                                  );
                                  setOpenSnackbar(true);
                                  refetch();
                                });
                                sendEmail(getDecisionEmailProps(booking, true));
                              }}
                              color="secondary"
                            >
                              <CheckIcon />
                            </IconButton>
                          </Box>
                        </Tooltip>
                        <Tooltip title="Avkreft">
                          <Box color={theme.palette.error.main} display="inline">
                            <IconButton
                              disabled={!booking.isTentative}
                              onClick={() => setBookingToBeDeleted(booking)}
                              color="inherit"
                            >
                              <ClearIcon />
                            </IconButton>
                          </Box>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </PermissionRequired>
      </Container>
    </Layout>
  );
};

export default AdminPage;
