import { KeyboardArrowRight } from "@mui/icons-material";
import { Button, Checkbox, FormControlLabel, Paper, Stack, TextField, Typography } from "@mui/material";

import { Stepper as BookingStepNavigation } from "@/components/pages/cabins/booking/Steps/Stepper";

import type { BookingStepsProps } from "./types";

export const ExtraInfoStep: React.FC<BookingStepsProps> = ({
  cleaningOptionEnabled,
  occasion,
  comment,
  guestListEntries,
  cleaningRequested,
  onOccasionChange,
  onCommentChange,
  onCleaningRequestedChange,
  onOpenGuestListDialog,
  onExtraInfoStepNext,
}) => {
  return (
    <Paper sx={{ p: 3, bgcolor: "background.elevated" }} elevation={0}>
      <Stack spacing={2}>
        <Typography variant="h5">Ekstra info</Typography>

        <TextField
          required
          label="Anledning"
          helperText="Hva skal huset brukes til? Dette står i kontrakten, og huset kan bare brukes til det."
          inputProps={{ maxLength: 200 }}
          value={occasion}
          onChange={(event) => onOccasionChange(event.target.value)}
        />

        <TextField
          label="Kommentar"
          multiline
          minRows={3}
          value={comment}
          onChange={(event) => onCommentChange(event.target.value)}
        />

        <Stack spacing={1}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
            <Button variant="outlined" onClick={onOpenGuestListDialog}>
              Rediger gjesteliste
            </Button>
            <Typography variant="body2" color="text.secondary">
              {guestListEntries.length > 0
                ? `Registrerte gjester: ${guestListEntries.length}`
                : "Ingen gjester registrert ennå"}
            </Typography>
          </Stack>

          {guestListEntries.length > 0 ? (
            <Typography variant="body2" color="text.secondary">
              {guestListEntries.join(", ")}
            </Typography>
          ) : null}
        </Stack>

        {cleaningOptionEnabled ? (
          <FormControlLabel
            control={
              <Checkbox
                checked={cleaningRequested}
                onChange={(event) => onCleaningRequestedChange(event.target.checked)}
              />
            }
            label="Ønsker innleid renhold (kostnad kommer i etterkant)"
          />
        ) : null}

        <BookingStepNavigation
          nextButton={
            <Button variant="contained" endIcon={<KeyboardArrowRight />} onClick={onExtraInfoStepNext}>
              Neste
            </Button>
          }
        />
      </Stack>
    </Paper>
  );
};
