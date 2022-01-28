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
import { CONFIRM_BOOKING, SEND_EMAIL } from "@graphql/cabins/mutations";
import { useState } from "react";
import { useRouter } from "next/router";
import theme from "@styles/theme";
import { BookingFromQuery } from "@interfaces/cabins";
import ErrorDialog from "@components/dialogs/ErrorDialog";
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
  const { data, error, refetch } = useQuery<{
    adminAllBookings: BookingFromQuery[];
  }>(QUERY_ADMIN_ALL_BOOKINGS, { variables: { after: dayjs().subtract(1, "day").format("YYYY-MM-DD") } });
  const [confirmBooking] = useMutation(CONFIRM_BOOKING, { refetchQueries: [{ query: QUERY_ADMIN_ALL_BOOKINGS }] });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [bookingToBeDeleted, setBookingToBeDeleted] = useState<BookingFromQuery | undefined>();
  const [send_email] = useMutation(SEND_EMAIL);
  const router = useRouter();

  const handleErrorDialogClose = () => router.push("/");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();

  return (
    <Layout>
      <Container>
        <Snackbar
          open={openSnackbar}
          message={snackbarMessage}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        />
        <ErrorDialog error={error} handleErrorDialogClose={handleErrorDialogClose} />
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
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Navn</TableCell>
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
                {data?.adminAllBookings.map((booking: BookingFromQuery) => (
                  <TableRow key={booking.id}>
                    <TableCell>{`${booking.firstName} ${booking.lastName}`}</TableCell>
                    <TableCell align="right">{booking.receiverEmail}</TableCell>
                    <TableCell align="right">{booking.phone}</TableCell>
                    <TableCell align="right">{booking.checkIn}</TableCell>
                    <TableCell align="right">{booking.checkOut}</TableCell>
                    <TableCell align="right">{toStringChosenCabins(booking.cabins)}</TableCell>
                    <TableCell align="right">{booking.isTentative ? "Ikke godkjent" : "Godkjent"}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Godkjenn">
                        <Box display="inline" component="span">
                          <IconButton
                            disabled={!booking.isTentative}
                            onClick={() => {
                              confirmBooking({ variables: { id: booking.id } }).then(() => {
                                setSnackbarMessage(
                                  `Booking bekreftet. Bekreftelsesmail sendt er sendt til ${booking.receiverEmail}.`
                                );
                                setOpenSnackbar(true);
                                refetch();
                              });
                              send_email(getDecisionEmailProps(booking, true));
                            }}
                            color="secondary"
                          >
                            <CheckIcon />
                          </IconButton>
                        </Box>
                      </Tooltip>
                      <Tooltip title="Avkreft">
                        <Box color={theme.palette.error.main} display="inline" component="span">
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
      </Container>
    </Layout>
  );
};

export default AdminPage;
