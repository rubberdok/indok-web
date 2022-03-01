import { BookingFromQuery } from "@interfaces/cabins";
import {
  Box,
  IconButton,
  Paper,
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

type Props = {
  bookings?: BookingFromQuery[];
  setOpenSnackbar?: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarMessage?: React.Dispatch<React.SetStateAction<string>>;
  setBookingToBeDeleted?: React.Dispatch<React.SetStateAction<BookingFromQuery | undefined>>;
  refetch?: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<{ adminAllBookings: BookingFromQuery[] }>>;
};

const AdminCabinTable = ({ bookings, setSnackbarMessage, setOpenSnackbar, setBookingToBeDeleted, refetch }: Props) => {
  const [confirmBooking] = useMutation(CONFIRM_BOOKING, { refetchQueries: [{ query: QUERY_ADMIN_ALL_BOOKINGS }] });
  const [send_email] = useMutation(SEND_EMAIL);

  return (
    <TableContainer component={Paper}>
      <Table size="small" style={{ display: "table" }}>
        <TableHead>
          <TableRow>
            <TableCell align="right">Navn</TableCell>
            <TableCell align="right">Epost</TableCell>
            <TableCell align="right">Telefonnummer</TableCell>
            <TableCell align="right">Innsjekk</TableCell>
            <TableCell align="right">Utsjekk</TableCell>
            <TableCell align="right">Hytte</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Handlinger</TableCell>
            <TableCell align="right">Tidspunkt</TableCell>
            <TableCell align="right">Antall indøkere</TableCell>
            <TableCell align="right">Antall eksterne</TableCell>
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
                {booking.isDeclined || booking.isTentative ? "Ikke godkjent" : "Godkjent"}
              </InlineTableCell>
              <InlineTableCell>
                <Tooltip title="Godkjenn">
                  <Box display="inline" component="span">
                    <IconButton
                      disabled={!booking.isTentative}
                      onClick={() => {
                        confirmBooking({ variables: { id: booking.id } }).then(() => {
                          if (setSnackbarMessage && setOpenSnackbar && refetch) {
                            setSnackbarMessage(
                              `Booking bekreftet. Bekreftelsesmail er sendt til ${booking.receiverEmail}.`
                            );
                            setOpenSnackbar(true);
                            refetch();
                          }
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
                      onClick={() => setBookingToBeDeleted && setBookingToBeDeleted(booking)}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminCabinTable;
