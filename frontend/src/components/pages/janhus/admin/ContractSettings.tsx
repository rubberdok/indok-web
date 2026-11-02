import { useMutation, useQuery } from "@apollo/client/react";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { JanHusContractSettingsDocument, UpdateJanhusBookingSettingsDocument } from "@/generated/graphql";

type ContractForm = {
  keyBoxCode: string;
  bookingContactName: string;
  bookingContactPhone: string;
  contractAddress: string;
  contractRentAmount: string;
  contractMaxFee: string;
  contractCleaningDeadlineHours: string;
};

const FIELDS: { name: keyof ContractForm; label: string; number?: boolean; maxLength?: number }[] = [
  { name: "keyBoxCode", label: "PIN-kode til nøkkelboksen", maxLength: 32 },
  { name: "bookingContactName", label: "Kontaktperson", maxLength: 200 },
  { name: "bookingContactPhone", label: "Telefon til kontaktperson", maxLength: 32 },
  { name: "contractAddress", label: "Adresse", maxLength: 200 },
  { name: "contractRentAmount", label: "Leiepris (kr)", number: true },
  { name: "contractMaxFee", label: "Gebyr ved mangler, inntil (kr)", number: true },
  { name: "contractCleaningDeadlineHours", label: "Frist for vask (timer)", number: true },
];

export const ContractSettings: React.FC = () => {
  const { data, loading, error: loadError } = useQuery(JanHusContractSettingsDocument, { fetchPolicy: "network-only" });
  const [typed, setTyped] = useState<Partial<ContractForm>>({});
  const [result, setResult] = useState<{ severity: "success" | "error"; message: string } | undefined>();

  const [updateSettings, { loading: saving }] = useMutation(UpdateJanhusBookingSettingsDocument, {
    onCompleted: () => setResult({ severity: "success", message: "Kontraktverdiene er lagret" }),
    onError: (error) => setResult({ severity: "error", message: error.message }),
  });

  const settings = data?.janhusBookingSettings;
  const valueOf = (name: keyof ContractForm) => typed[name] ?? String(settings?.[name] ?? "");
  const isEmptyNumber = (name: keyof ContractForm) => valueOf(name).trim() === "";
  const hasEmptyNumber = FIELDS.some(({ name, number }) => number && isEmptyNumber(name));

  const save = () =>
    updateSettings({
      variables: {
        settingsData: {
          keyBoxCode: valueOf("keyBoxCode"),
          bookingContactName: valueOf("bookingContactName"),
          bookingContactPhone: valueOf("bookingContactPhone"),
          contractAddress: valueOf("contractAddress"),
          contractRentAmount: Number(valueOf("contractRentAmount")),
          contractMaxFee: Number(valueOf("contractMaxFee")),
          contractCleaningDeadlineHours: Number(valueOf("contractCleaningDeadlineHours")),
        },
      },
    });

  return (
    <Paper sx={{ p: 3 }} elevation={0}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h4" component="h2">
          Kontrakten
        </Typography>
        <Typography>
          Disse verdiene står i kontrakten. PIN-koden står bare i kontrakten som sendes når en booking blir godkjent.
          Kontaktperson og telefon står også i e-postene.
        </Typography>

        {loadError ? <Alert severity="error">Kunne ikke hente kontraktverdiene.</Alert> : null}
        {result ? <Alert severity={result.severity}>{result.message}</Alert> : null}

        <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
          {FIELDS.map(({ name, label, number, maxLength }) => (
            <TextField
              key={name}
              label={label}
              type={number ? "number" : "text"}
              autoComplete="off"
              inputProps={number ? { min: 0 } : { maxLength }}
              value={valueOf(name)}
              disabled={loading || Boolean(loadError)}
              error={Boolean(number) && !loading && !loadError && isEmptyNumber(name)}
              onChange={(event) => setTyped((prev) => ({ ...prev, [name]: event.target.value }))}
            />
          ))}
        </Box>

        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            disabled={loading || saving || Boolean(loadError) || hasEmptyNumber}
            onClick={save}
          >
            Lagre kontraktverdiene
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
