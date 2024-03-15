import { Send } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CardHeader, Container, Stack, Typography } from "@mui/material";

import { BookingDetailsFields } from "./BookingDetails";

type Props = {
  dates: {
    start: Date | undefined;
    end: Date | undefined;
  };
  selectedCabins: { id: string; name: string }[];
  bookingDetails: BookingDetailsFields;
  onSubmit: () => void;
  onPrevious: () => void;
  price: number;
};

function Summary({ dates, selectedCabins, bookingDetails, onSubmit, onPrevious, price }: Props) {
  return (
    <Container maxWidth="sm" disableGutters>
      <Card>
        <CardHeader title="Oppsummering" />
        <CardContent>
          <Stack direction="column">
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Dato</Typography>
              <Typography variant="body1">
                {dates.start?.toLocaleDateString()} - {dates.end?.toLocaleDateString()}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Hytter</Typography>
              <Typography variant="body1">{selectedCabins.map((cabin) => cabin.name).join(", ")}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Pris</Typography>
              <Typography variant="body1">{price} kr</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Navn</Typography>
              <Typography variant="body1">
                {bookingDetails.firstName} {bookingDetails.lastName}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">E-post</Typography>
              <Typography variant="body1">{bookingDetails.email}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Telefon</Typography>
              <Typography variant="body1">{bookingDetails.phone}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Interne deltakere</Typography>
              <Typography variant="body1">{bookingDetails.internalParticipants}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Eksterne deltakere</Typography>
              <Typography variant="body1">{bookingDetails.externalParticipants}</Typography>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions>
          <Stack direction="row" width="100%" justifyContent="flex-end" spacing={2}>
            <Button onClick={onPrevious}>Tilbake</Button>
            <Button onClick={onSubmit} variant="contained" endIcon={<Send />}>
              Send søknad
            </Button>
          </Stack>
        </CardActions>
      </Card>
    </Container>
  );
}
export { Summary };
