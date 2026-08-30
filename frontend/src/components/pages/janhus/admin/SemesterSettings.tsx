import { Box, Button, FormControlLabel, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import type { SettingsForm } from "@/components/pages/janhus/constants";

type Props = {
  settingsForm: SettingsForm;
  setSettingsForm: Dispatch<SetStateAction<SettingsForm>>;
  settingsSaving: boolean;
  saveSettings: () => void;
};

export const SemesterSettings: React.FC<Props> = ({ settingsForm, setSettingsForm, settingsSaving, saveSettings }) => (
  <Paper sx={{ p: 3 }} elevation={0}>
    <Stack direction="column" spacing={2}>
      <Typography variant="h4" component="h2">
        Start- og sluttdato for høst- og vårsemester
      </Typography>
      <Typography>Det vil kun være mulig for brukere å søke om bookinger i disse periodene.</Typography>

      <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
        <Stack spacing={2}>
          <Typography variant="h6">Høstsemester</Typography>
          <TextField
            label="Start"
            type="date"
            value={settingsForm.fallStartDate}
            onChange={(event) =>
              setSettingsForm((prev) => ({
                ...prev,
                fallStartDate: event.target.value,
              }))
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Slutt"
            type="date"
            value={settingsForm.fallEndDate}
            onChange={(event) =>
              setSettingsForm((prev) => ({
                ...prev,
                fallEndDate: event.target.value,
              }))
            }
            InputLabelProps={{ shrink: true }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={settingsForm.fallSemesterActive}
                onChange={(event) =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    fallSemesterActive: event.target.checked,
                  }))
                }
              />
            }
            label="Åpent for bestillinger"
          />
        </Stack>

        <Stack spacing={2}>
          <Typography variant="h6">Vårsemester</Typography>
          <TextField
            label="Start"
            type="date"
            value={settingsForm.springStartDate}
            onChange={(event) =>
              setSettingsForm((prev) => ({
                ...prev,
                springStartDate: event.target.value,
              }))
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Slutt"
            type="date"
            value={settingsForm.springEndDate}
            onChange={(event) =>
              setSettingsForm((prev) => ({
                ...prev,
                springEndDate: event.target.value,
              }))
            }
            InputLabelProps={{ shrink: true }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={settingsForm.springSemesterActive}
                onChange={(event) =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    springSemesterActive: event.target.checked,
                  }))
                }
              />
            }
            label="Åpent for bestillinger"
          />
        </Stack>
      </Box>

      <Box>
        <Button variant="contained" onClick={saveSettings} disabled={settingsSaving}>
          Lagre semestre og regler
        </Button>
      </Box>
    </Stack>
  </Paper>
);
