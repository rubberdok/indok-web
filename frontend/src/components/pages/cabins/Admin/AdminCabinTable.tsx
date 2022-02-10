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

type CabinTableProps = {
  bookings?: BookingFromQuery[];
  setOpenSnackbar?: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarMessage?: React.Dispatch<React.SetStateAction<string>>;
  setBookingToBeDeleted?: any;
  refetch?: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<{ adminAllBookings: BookingFromQuery[] }>>;
};

const AdminCabinTable = ({
  bookings,
  setSnackbarMessage,
  setOpenSnackbar,
  setBookingToBeDeleted,
  refetch,
}: CabinTableProps) => {
  const [confirmBooking] = useMutation(CONFIRM_BOOKING, { refetchQueries: [{ query: QUERY_ADMIN_ALL_BOOKINGS }] });
  const [send_email] = useMutation(SEND_EMAIL);

  return (
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
          {bookings?.map((booking: BookingFromQuery) => (
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
                          if (setSnackbarMessage && setOpenSnackbar && refetch) {
                            setSnackbarMessage(
                              `Booking bekreftet. Bekreftelsesmail sendt er sendt til ${booking.receiverEmail}.`
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
  );
};

export default AdminCabinTable;
