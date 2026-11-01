import { Alert, Box, Button, Grid, MenuItem, TextField } from "@mui/material";

import { currentGradeYear, maxGraduationYear } from "@/components/pages/profile/UserForm/helpers";

import type { AdminEditableUser, AdminEditForm, SetAdminEditForm } from "./types";

function formatAdminDate(value: string | null | undefined): string {
  return value ? new Date(value).toLocaleString() : "";
}

type Props = {
  selectedUser: AdminEditableUser;
  formData: AdminEditForm;
  setFormData: SetAdminEditForm;
  saveUserError: string;
  savingUser: boolean;
  onSaveUser: () => void;
};

export function ProfileFields({
  selectedUser,
  formData,
  setFormData,
  saveUserError,
  savingUser,
  onSaveUser,
}: Readonly<Props>) {
  const currentYear = new Date().getFullYear();
  const minimumGraduationYear = Math.min(currentYear, selectedUser?.graduationYear ?? currentYear);
  const graduationYears = Array.from(
    { length: maxGraduationYear - minimumGraduationYear + 1 },
    (_, i) => minimumGraduationYear + i
  );

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField label="Brukernavn" fullWidth value={formData.username} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Feide bruker-id"
            fullWidth
            value={selectedUser.feideUserid || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Fornavn"
            fullWidth
            value={formData.firstName}
            onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Etternavn"
            fullWidth
            value={formData.lastName}
            onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="E-post"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Feide e-post"
            fullWidth
            value={selectedUser.feideEmail || ""}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Telefon"
            fullWidth
            value={formData.phoneNumber}
            onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Allergier"
            fullWidth
            value={formData.allergies}
            onChange={(e) => setFormData((prev) => ({ ...prev, allergies: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField label="Klasse" fullWidth value={selectedUser.gradeYear ?? ""} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            select
            label="Uteksamineringsår"
            fullWidth
            value={formData.graduationYear}
            onChange={(e) => setFormData((prev) => ({ ...prev, graduationYear: e.target.value }))}
          >
            {graduationYears.map((year) => (
              <MenuItem key={year} value={String(year)}>
                {`${year} (${currentGradeYear(year)}. klasse)`}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Sist innlogget"
            fullWidth
            value={formatAdminDate(selectedUser.lastLogin)}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Opprettet"
            fullWidth
            value={formatAdminDate(selectedUser.dateJoined)}
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>

      {saveUserError && <Alert severity="error">{saveUserError}</Alert>}

      <Box>
        <Button variant="contained" onClick={onSaveUser} disabled={savingUser}>
          {savingUser ? "Lagrer..." : "Lagre bruker"}
        </Button>
      </Box>
    </>
  );
}
