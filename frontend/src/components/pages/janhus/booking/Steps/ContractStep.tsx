import { useQuery } from "@apollo/client/react";
import { KeyboardArrowRight } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { Stepper as BookingStepNavigation } from "@/components/pages/cabins/booking/Steps/Stepper";
import { normalizePhoneNumber } from "@/components/pages/janhus/validation";
import { JanHusContractPreviewDocument } from "@/generated/graphql";

import type { BookingStepsProps } from "./types";

export const ContractStep: React.FC<BookingStepsProps> = ({
  startsAt,
  endsAt,
  area,
  requesterName,
  requesterEmail,
  requesterPhone,
  occasion,
  guidelinesUrl,
  acceptedGuidelines,
  acceptedContract,
  onAcceptedGuidelinesChange,
  onAcceptedContractChange,
  onContractStepNext,
}) => {
  const { data, loading } = useQuery(JanHusContractPreviewDocument, {
    fetchPolicy: "cache-and-network",
    variables: {
      contractData: {
        startsAt,
        endsAt,
        area,
        requesterName,
        requesterEmail,
        requesterPhone: normalizePhoneNumber(requesterPhone),
        occasion,
      },
    },
  });
  const contractHtml = data?.janhusContractPreview;

  return (
    <Paper sx={{ p: 3, bgcolor: "background.elevated" }} elevation={0}>
      <Stack spacing={2}>
        <Typography variant="h5">Kontrakt og retningslinjer</Typography>

        {guidelinesUrl ? (
          <>
            <Alert severity="info">
              <Typography variant="subtitle2" gutterBottom>
                JanHus retningslinjer
              </Typography>
              Les{" "}
              <Link href={guidelinesUrl} target="_blank" rel="noopener noreferrer" color="inherit" underline="always">
                JanHus retningslinjer
              </Link>{" "}
              før du går videre.
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
          </>
        ) : null}

        <Typography variant="subtitle1" component="h3">
          Leiekontrakt
        </Typography>

        {contractHtml ? (
          <Box
            data-test-id="janhus-contract"
            sx={{
              maxHeight: 480,
              overflow: "auto",
              p: 2,
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              typography: "body2",
              "& h3": { typography: "subtitle1", mt: 2, mb: 0.5 },
              "& h3:first-of-type": { mt: 0 },
              "& p, & ul": { mt: 0, mb: 1 },
              "& ul": { pl: 3 },
            }}
            dangerouslySetInnerHTML={{ __html: contractHtml }}
          />
        ) : null}
        {!contractHtml && loading ? <CircularProgress size={24} /> : null}
        {!contractHtml && !loading ? (
          <Alert severity="error">
            Kunne ikke hente kontrakten. Prøv igjen, eller gå et steg tilbake og sjekk at tidspunkt og område er valgt.
          </Alert>
        ) : null}

        <FormControlLabel
          control={
            <Checkbox
              checked={acceptedContract}
              disabled={!contractHtml}
              onChange={(event) => onAcceptedContractChange(event.target.checked)}
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
