import { ApolloQueryResult, OperationVariables, useMutation } from "@apollo/client";
import { DECLINE_BOOKING, SEND_EMAIL } from "@graphql/cabins/mutations";
import { QUERY_ADMIN_ALL_BOOKINGS } from "@graphql/cabins/queries";
import { BookingFromQuery } from "@interfaces/cabins";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { convertDateFormat, getDecisionEmailProps, toStringChosenCabins } from "@utils/cabins";
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
  const handleDeclineBookingOnClose = () => setBookingToBeDeclined(undefined);
  const [sendEmail] = useMutation(SEND_EMAIL);

  return (
    <Dialog open={bookingToBeDeclined != undefined} onClose={handleDeclineBookingOnClose}>
      <DialogTitle>
        Underkjenning av booking fra {bookingToBeDeclined?.firstName} {bookingToBeDeclined?.lastName} fra{" "}
        {convertDateFormat(bookingToBeDeclined?.checkIn)} til {convertDateFormat(bookingToBeDeclined?.checkOut)} av{" "}
        {toStringChosenCabins(bookingToBeDeclined ? bookingToBeDeclined.cabins : [])}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Er du sikker på at du vil underkjenne denne bookingen?</DialogContentText>
        <DialogContentText>
          Det kan være nyttig for {bookingToBeDeclined?.firstName} å få vite hvorfor dere avslår søknaden om booking.
          Hvis dere vil oppgi grunnen til avslag, kan dere gjøre det nedenfor.
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
        <Button onClick={handleDeclineBookingOnClose} variant="contained">
          Avbryt
        </Button>
        <Button
          onClick={() => {
            if (bookingToBeDeclined) {
              sendEmail(getDecisionEmailProps(bookingToBeDeclined, false, declineMessage));
              declineBooking({ variables: { id: bookingToBeDeclined.id, declineReason: declineMessage } }).then(() => {
                setSnackbarMessage(`Bookingen er underkjent. Mail er sendt til ${bookingToBeDeclined.receiverEmail}.`);
                setOpenSnackbar(true);
                refetch();
              });
            }
            handleDeclineBookingOnClose();
          }}
          color="primary"
          variant="contained"
        >
          Underkjenn booking
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeclineBookingDialog;
