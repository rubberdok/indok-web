import { Alert, Box, Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from "@mui/material";

import { MIFARE_CSN_RULE_TEXT, type AdminEditableUser, type AdminEditForm, type SetAdminEditForm } from "./types";

type Props = {
  selectedUser: AdminEditableUser;
  formData: AdminEditForm;
  setFormData: SetAdminEditForm;
  canManageProfiles: boolean;
  saveNfcError: string;
  setSaveNfcError: (message: string) => void;
  saveNfcSuccess: string;
  setSaveNfcSuccess: (message: string) => void;
  savingNfc: boolean;
  onSaveNfc: () => void;
};

export function NfcFields({
  selectedUser,
  formData,
  setFormData,
  canManageProfiles,
  saveNfcError,
  setSaveNfcError,
  saveNfcSuccess,
  setSaveNfcSuccess,
  savingNfc,
  onSaveNfc,
}: Readonly<Props>) {
  return (
    <>
      <Typography variant="subtitle1">MIFARE kortnummer/PIN</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Kortnummer"
            fullWidth
            value={formData.nfcMifareCsn}
            onChange={(e) => {
              setSaveNfcError("");
              setSaveNfcSuccess("");
              setFormData((prev) => ({ ...prev, nfcMifareCsn: e.target.value }));
            }}
            placeholder="F.eks. 1234567890"
            inputProps={{ inputMode: "numeric" }}
            helperText={
              selectedUser?.nfcMifareCsn
                ? `${MIFARE_CSN_RULE_TEXT} Dørnummer i ARX: ${selectedUser.nfcMifareCsn}`
                : MIFARE_CSN_RULE_TEXT
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="PIN-kode (4 sifre)"
            fullWidth
            value={formData.nfcPinCode}
            onChange={(e) => {
              setSaveNfcError("");
              setSaveNfcSuccess("");
              setFormData((prev) => ({ ...prev, nfcPinCode: e.target.value }));
            }}
            inputProps={{ maxLength: 4, inputMode: "numeric", pattern: "[0-9]{4}" }}
            helperText={
              selectedUser?.nfcHasPin
                ? "PIN er satt. Skriv inn en ny PIN for å endre den."
                : "PIN krever at bruker har kortnummer (eksisterende eller nytt)."
            }
          />
        </Grid>
      </Grid>
      {canManageProfiles && (
        <Box>
          <Typography variant="subtitle1">Permanent tilgang</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(formData.nfcPermanentAccess)}
                onChange={(_, checked) => {
                  setSaveNfcError("");
                  setSaveNfcSuccess("");
                  setFormData((prev) => ({ ...prev, nfcPermanentAccess: checked }));
                }}
              />
            }
            label={
              formData.nfcPermanentAccess
                ? "Tilgang til JanHus hele tiden (krever kort og PIN)"
                : "Bare tilgang under egne bookinger"
            }
          />
        </Box>
      )}
      {saveNfcError && <Alert severity="error">{saveNfcError}</Alert>}
      {saveNfcSuccess && <Alert severity="success">{saveNfcSuccess}</Alert>}

      <Box>
        <Button variant="contained" onClick={onSaveNfc} disabled={savingNfc}>
          {savingNfc ? "Lagrer MIFARE..." : "Lagret MIFARE kortnummer/PIN"}
        </Button>
      </Box>
    </>
  );
}
