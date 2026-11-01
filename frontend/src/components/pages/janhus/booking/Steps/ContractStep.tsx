import { KeyboardArrowRight } from "@mui/icons-material";
import { Alert, Button, Checkbox, FormControlLabel, Paper, Stack, Typography } from "@mui/material";

import { Stepper as BookingStepNavigation } from "@/components/pages/cabins/booking/Steps/Stepper";

import type { BookingStepsProps } from "./types";

export const ContractStep: React.FC<BookingStepsProps> = ({
  acceptedGuidelines,
  acceptedContractPlaceholder,
  onAcceptedGuidelinesChange,
  onAcceptedContractPlaceholderChange,
  onContractStepNext,
}) => {
  return (
    <Paper sx={{ p: 3, bgcolor: "background.elevated" }} elevation={0}>
      <Stack spacing={2}>
        <Typography variant="h5">Kontrakt og retningslinjer</Typography>

        <Alert severity="info">
          <Typography variant="subtitle2" gutterBottom>
            JanHus retningslinjer
          </Typography>
          HER KOMMER RETTNINGSLINJENE FOR BRUK OG BOOKING AV JANHUS.
        </Alert>

        <FormControlLabel
          control={
            <Checkbox
              checked={acceptedGuidelines}
              onChange={(event) => onAcceptedGuidelinesChange(event.target.checked)}
            />
          }
          label="Jeg bekrefter at jeg har lest JanHus retningslinjer"
        />

        <Alert severity="warning">
          <Typography variant="subtitle2" gutterBottom>
            Kontrakt
          </Typography>
          HER KOMMER KONTRAKTEN.
        </Alert>

        <FormControlLabel
          control={
            <Checkbox
              checked={acceptedContractPlaceholder}
              onChange={(event) => onAcceptedContractPlaceholderChange(event.target.checked)}
            />
          }
          label="Jeg forstår og aksepterer kontraktsvilkårene"
        />

        <BookingStepNavigation
          nextButton={
            <Button variant="contained" endIcon={<KeyboardArrowRight />} onClick={onContractStepNext}>
              Neste
            </Button>
          }
        />
      </Stack>
    </Paper>
  );
};
