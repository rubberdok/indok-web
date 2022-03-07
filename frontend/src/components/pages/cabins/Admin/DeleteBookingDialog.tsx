import { ApolloQueryResult, OperationVariables, useMutation } from "@apollo/client";
import { DECLINE_BOOKING, SEND_EMAIL } from "@graphql/cabins/mutations";
import { QUERY_ADMIN_ALL_BOOKINGS } from "@graphql/cabins/queries";
import { BookingFromQuery } from "@interfaces/cabins";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";
import { getDecisionEmailProps } from "@utils/cabins";
import { useState } from "react";

type DialogProps = {
  bookingToBeDeclined?: BookingFromQuery;
  setBookingToBeDeclined: React.Dispatch<React.SetStateAction<BookingFromQuery | undefined>>;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<{ adminAllBookings: BookingFromQuery[] }>>;
};

const DeclineBookingDialog: React.VFC<DialogProps> = ({
  bookingToBeDeclined: bookingToBeDeclined,
  setBookingToBeDeclined,
  setOpenSnackbar,
  setSnackbarMessage,
  refetch,
}) => {
  const [declineMessage, setDeclineMessage] = useState("");
  const [declineBooking] = useMutation(DECLINE_BOOKING, { refetchQueries: [{ query: QUERY_ADMIN_ALL_BOOKINGS }] });
  const handleDeleteBookingOnClose = () => setBookingToBeDeclined(undefined);
  const [send_email] = useMutation(SEND_EMAIL);

  return (
    <Dialog open={bookingToBeDeclined != undefined} onClose={handleDeleteBookingOnClose}>
      <DialogTitle>Du er nå i ferd med å gjøre en irreversibel handling</DialogTitle>
      <DialogContent>
        <DialogContentText>Er du sikker på at du vil slette denne bookingen?</DialogContentText>
        <DialogContentText>
          Det kan være nyttig for brukeren å få vite hvorfor dere avslår søknaden om booking. Hvis dere vil oppgi
          grunnen til avslag, kan dere gjøre det nedenfor.
        </DialogContentText>
        <TextField
          placeholder="Grunn til avslag..."
          variant="outlined"
          multiline
          rows={6}
          fullWidth
          onChange={(e) => setDeclineMessage(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteBookingOnClose} variant="contained">
          Avbryt
        </Button>
        <Button
          onClick={() => {
            if (bookingToBeDeclined) {
              send_email(getDecisionEmailProps(bookingToBeDeclined, false, declineMessage));
              declineBooking({ variables: { id: bookingToBeDeclined.id } }).then(() => {
                setSnackbarMessage(`Bookingen er underkjent. Mail er sendt til ${bookingToBeDeclined.receiverEmail}.`);
                setOpenSnackbar(true);
                refetch();
              });
            }
            handleDeleteBookingOnClose();
          }}
          color="primary"
          variant="contained"
        >
          Slett booking
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeclineBookingDialog;
