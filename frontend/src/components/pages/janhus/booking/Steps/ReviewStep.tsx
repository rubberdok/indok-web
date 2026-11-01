import { Send } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { Stepper as BookingStepNavigation } from "@/components/pages/cabins/booking/Steps/Stepper";
import { JANHUS_EVENT_TYPE_LABELS } from "@/components/pages/janhus/constants";
import dayjs from "@/lib/date";

import { JANHUS_OWNER_TYPE_LABELS, type BookingStepsProps } from "./types";

export const ReviewStep: React.FC<BookingStepsProps> = ({
  startsAt,
  endsAt,
  ownerType,
  cleaningOptionEnabled,
  requesterName,
  requesterEmail,
  requesterPhone,
  eventType,
  comment,
  guestListEntries,
  cleaningRequested,
  selectedAreaLabel,
  loading,
  onSubmitBooking,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      {confirmOpen ? (
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogContent>Er du sikker på at du vil sende denne bookingforespørselen?</DialogContent>
          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={() => setConfirmOpen(false)}>
              Avbryt
            </Button>
            <Button
              endIcon={<Send />}
              variant="contained"
              onClick={async () => {
                await onSubmitBooking();
                setConfirmOpen(false);
              }}
              disabled={loading}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}

      <Paper sx={{ p: 3, bgcolor: "background.elevated" }} elevation={0}>
        <Stack spacing={2}>
          <Typography variant="h5">Se over og send søknad</Typography>

          <Typography variant="body1">
            <strong>Område:</strong> {selectedAreaLabel}
          </Typography>
          <Typography variant="body1">
            <strong>Tidsrom:</strong> {startsAt ? dayjs(startsAt).format("DD.MM.YYYY HH:mm") : "-"} –{" "}
            {endsAt ? dayjs(endsAt).format("DD.MM.YYYY HH:mm") : "-"}
          </Typography>
          <Typography variant="body1">
            <strong>Bestiller:</strong> {requesterName || "-"} ({requesterEmail || "-"})
          </Typography>
          <Typography variant="body1">
            <strong>Telefon:</strong> {requesterPhone || "-"}
          </Typography>
          <Typography variant="body1">
            <strong>Eiertype:</strong> {JANHUS_OWNER_TYPE_LABELS[ownerType]}
          </Typography>
          <Typography variant="body1">
            <strong>Arrangementstype:</strong>{" "}
            {ownerType === "EXTERNAL"
              ? JANHUS_EVENT_TYPE_LABELS.EXTERNAL
              : (JANHUS_EVENT_TYPE_LABELS[eventType] ?? eventType)}
          </Typography>
          {cleaningOptionEnabled ? (
            <Typography variant="body1">
              <strong>Renhold:</strong> {cleaningRequested ? "Ja" : "Nei"}
            </Typography>
          ) : null}
          <Typography variant="body1">
            <strong>Gjesteliste:</strong>{" "}
            {guestListEntries.length > 0 ? `${guestListEntries.length} registrerte` : "Ingen"}
          </Typography>
          {comment ? (
            <Typography variant="body1">
              <strong>Kommentar:</strong> {comment}
            </Typography>
          ) : null}

          <BookingStepNavigation
            nextButton={
              <Button variant="contained" endIcon={<Send />} onClick={() => setConfirmOpen(true)} disabled={loading}>
                Send søknad
              </Button>
            }
          />
        </Stack>
      </Paper>
    </>
  );
};
