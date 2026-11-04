import { useMutation } from "@apollo/client/react";
import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { AdminUpdateUserNfcDocument } from "@/generated/graphql";

import { PermanentAccessStatusChip, formatDate } from "./DoorAccessTable";
import { adminEditFormFor, nfcInputFor, toErrorMessage, validateNfcInput } from "./helpers";
import { NfcFields } from "./NfcFields";
import type { AdminEditableUser, AdminEditForm } from "./types";

type Props = {
  user: AdminEditableUser;
  onSaved: () => Promise<AdminEditableUser | null | undefined>;
};

export function NfcUserEditor({ user, onSaved }: Readonly<Props>) {
  const [formData, setFormData] = useState<AdminEditForm>(adminEditFormFor(user));
  const [saveNfcError, setSaveNfcError] = useState("");
  const [saveNfcSuccess, setSaveNfcSuccess] = useState("");

  const [adminUpdateUserNfc, { loading: savingNfc }] = useMutation(AdminUpdateUserNfcDocument);

  const onSaveNfc = async () => {
    setSaveNfcError("");
    setSaveNfcSuccess("");

    const validationMessage = validateNfcInput(user, formData);
    if (validationMessage) {
      setSaveNfcError(validationMessage);
      return;
    }

    try {
      await adminUpdateUserNfc({
        variables: { userId: user.id, nfcData: nfcInputFor(user, formData, { withNote: true }) },
      });
    } catch (error) {
      setSaveNfcError(toErrorMessage(error, "Klarte ikke å lagre."));
      return;
    }

    try {
      const saved = await onSaved();
      if (saved) {
        setFormData(adminEditFormFor(saved));
      }
      setSaveNfcSuccess("Lagret.");
    } catch {
      setSaveNfcError("Lagret, men klarte ikke å hente det oppdaterte. Last inn siden på nytt.");
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="h6">
              {user.firstName} {user.lastName}
            </Typography>
            {user.nfcPermanentAccess && <PermanentAccessStatusChip status={user.nfcPermanentAccessStatus} />}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {user.feideEmail || user.email || "Ingen e-post"} ・ Avgangsår: {user.graduationYear ?? "-"}
            {user.nfcPermanentAccessEnds ? ` ・ Tilgangen slutter ${formatDate(user.nfcPermanentAccessEnds)}` : ""}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {(user.organizations ?? []).map((organization) => (
              <Chip key={organization.id} size="small" label={organization.name} />
            ))}
          </Stack>

          <NfcFields
            selectedUser={user}
            formData={formData}
            setFormData={setFormData}
            showNote
            saveNfcError={saveNfcError}
            setSaveNfcError={setSaveNfcError}
            saveNfcSuccess={saveNfcSuccess}
            setSaveNfcSuccess={setSaveNfcSuccess}
            savingNfc={savingNfc}
            onSaveNfc={onSaveNfc}
          />

          <Typography variant="subtitle1">Historikk for permanent tilgang</Typography>
          {(user.nfcPermanentAccessHistory ?? []).length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Ingen endringer registrert.
            </Typography>
          ) : (
            <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2 }}>
              {(user.nfcPermanentAccessHistory ?? []).map((change, index) => (
                <Typography component="li" variant="body2" key={`${change.changedAt}-${index}`}>
                  {formatDate(change.changedAt)}: {change.given ? "Gitt" : "Fjernet"} av {change.changedBy || "ukjent"}
                  {change.reason ? ` (${change.reason})` : ""}
                </Typography>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
