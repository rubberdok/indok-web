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
  bookingToBeDeleted?: BookingFromQuery;
  setBookingToBeDeleted: React.Dispatch<React.SetStateAction<BookingFromQuery | undefined>>;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<{ adminAllBookings: BookingFromQuery[] }>>;
};

const DeleteBookingDialog: React.VFC<DialogProps> = ({
  bookingToBeDeleted,
  setBookingToBeDeleted,
  setOpenSnackbar,
  setSnackbarMessage,
  refetch,
}) => {
  const [declineMessage, setDeclineMessage] = useState("");
  const [declineBooking] = useMutation(DECLINE_BOOKING, { refetchQueries: [{ query: QUERY_ADMIN_ALL_BOOKINGS }] });
  const handleDeleteBookingOnClose = () => setBookingToBeDeleted(undefined);
  const [send_email] = useMutation(SEND_EMAIL);

  return (
    <Dialog open={bookingToBeDeleted != undefined} onClose={handleDeleteBookingOnClose}>
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
            if (bookingToBeDeleted) {
              declineBooking({ variables: { id: bookingToBeDeleted.id } }).then(() => {
                setSnackbarMessage("Bookingen ble slettet");
                setOpenSnackbar(true);
                refetch();
              });
              send_email(getDecisionEmailProps(bookingToBeDeleted, false, declineMessage));
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

export default DeleteBookingDialog;
