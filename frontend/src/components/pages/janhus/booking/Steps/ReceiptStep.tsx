import { Paper, Stack, Typography } from "@mui/material";

import type { BookingStepsProps } from "./types";

export const ReceiptStep: React.FC<BookingStepsProps> = ({ submittedBookingReference }) => {
  return (
    <Paper sx={{ p: 3, bgcolor: "background.elevated" }} elevation={0}>
      <Stack spacing={2}>
        <Typography variant="h4">Kvittering</Typography>
        <Typography variant="body1">Din bookingforespørsel er sendt til Janus Eiendom.</Typography>
        <Typography variant="body1">
          <strong>Referanse:</strong> {submittedBookingReference ?? "Ikke tilgjengelig"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ta vare på referansen — oppgi den hvis du kontakter Janus Eiendom om bookingen.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Du får oppfølging på e-post når forespørselen er behandlet.
        </Typography>
      </Stack>
    </Paper>
  );
};
