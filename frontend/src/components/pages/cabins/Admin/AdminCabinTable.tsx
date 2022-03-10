import { BookingFromQuery } from "@interfaces/cabins";
import {
  Box,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import theme from "@styles/theme";
import { toStringChosenCabins, getDecisionEmailProps } from "@utils/cabins";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import { ApolloQueryResult, OperationVariables, useMutation } from "@apollo/client";
import { CONFIRM_BOOKING, SEND_EMAIL } from "@graphql/cabins/mutations";
import { QUERY_ADMIN_ALL_BOOKINGS } from "@graphql/cabins/queries";
import dayjs from "dayjs";
import InlineTableCell from "./InlineTableCell";
import React, { useState } from "react";
import { Alert } from "@material-ui/lab";
import DeclineBookingDialog from "./DeclineBookingDialog";

type Props = {
  bookings?: BookingFromQuery[];
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<{ adminAllBookings: BookingFromQuery[] }>>;
  currentTab: string;
};

const AdminCabinTable = ({ bookings, refetch, currentTab }: Props) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [bookingToBeDeclined, setBookingToBeDeclined] = useState<BookingFromQuery | undefined>();
  const [confirmBooking] = useMutation(CONFIRM_BOOKING, { refetchQueries: [{ query: QUERY_ADMIN_ALL_BOOKINGS }] });
  const [send_email] = useMutation(SEND_EMAIL);

  const isExpired = (booking: BookingFromQuery) => dayjs().isAfter(booking.checkIn);
  const isDeclinedTab = currentTab == "declined";

  return (
    <TableContainer component={Paper}>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success">{snackbarMessage}</Alert>
      </Snackbar>
      <DeclineBookingDialog
        bookingToBeDeclined={bookingToBeDeclined}
        setBookingToBeDeclined={setBookingToBeDeclined}
        setSnackbarMessage={setSnackbarMessage}
        setOpenSnackbar={setOpenSnackbar}
        refetch={refetch}
      />
      <Table size="small" style={{ display: "table" }}>
        <TableHead>
          <TableRow>
            <TableCell align="right">Navn</TableCell>
            <TableCell align="right">Epost</TableCell>
            <TableCell align="right">Telefonnummer</TableCell>
            <TableCell align="right">Innsjekk</TableCell>
            <TableCell align="right">Utsjekk</TableCell>
            <TableCell align="right">Hytte</TableCell>
            <TableCell align="right">Handlinger</TableCell>
            <TableCell align="right">Tidspunkt</TableCell>
            <TableCell align="right">Antall indøkere</TableCell>
            <TableCell align="right">Antall eksterne</TableCell>
            <TableCell align="right">Info fra bruker</TableCell>
            {isDeclinedTab ? <TableCell align="right">Grunn til avslag</TableCell> : <></>}
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings?.map((booking: BookingFromQuery) => (
            <TableRow key={booking.id}>
              <InlineTableCell>{`${booking.firstName} ${booking.lastName}`}</InlineTableCell>
              <InlineTableCell>{booking.receiverEmail}</InlineTableCell>
              <InlineTableCell>{booking.phone}</InlineTableCell>
              <InlineTableCell>{booking.checkIn}</InlineTableCell>
              <InlineTableCell>{booking.checkOut}</InlineTableCell>
              <InlineTableCell>{toStringChosenCabins(booking.cabins)}</InlineTableCell>
              <InlineTableCell>
                <Tooltip title="Godkjenn">
                  <Box display="inline" component="span">
                    <IconButton
                      disabled={(!booking.isTentative && !booking.isDeclined) || isExpired(booking)}
                      onClick={() => {
                        confirmBooking({ variables: { id: booking.id } }).then(() => {
                          setSnackbarMessage(
                            `Booking bekreftet. Bekreftelsesmail er sendt til ${booking.receiverEmail}.`
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
                      disabled={(!booking.isTentative && booking.isDeclined) || isExpired(booking)}
                      onClick={() => setBookingToBeDeclined && setBookingToBeDeclined(booking)}
                      color="inherit"
                    >
                      <ClearIcon />
                    </IconButton>
                  </Box>
                </Tooltip>
              </InlineTableCell>
              <InlineTableCell>{dayjs(booking.timestamp).format("HH:mm DD-MM-YYYY")}</InlineTableCell>
              <InlineTableCell>{booking.internalParticipants}</InlineTableCell>
              <InlineTableCell>{booking.externalParticipants}</InlineTableCell>
              <InlineTableCell>{booking.extraInfo}</InlineTableCell>
              {isDeclinedTab ? <InlineTableCell>{booking.declineReason}</InlineTableCell> : <></>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminCabinTable;
