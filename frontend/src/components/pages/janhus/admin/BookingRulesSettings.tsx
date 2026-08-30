import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import type { SettingsForm } from "@/components/pages/janhus/constants";

type Props = {
  openingHourOptions: readonly number[];
  closingHourOptions: readonly { value: number; label: string }[];
  settingsForm: SettingsForm;
  setSettingsForm: Dispatch<SetStateAction<SettingsForm>>;
  settingsSaving: boolean;
  saveSettings: () => void;
};

export const BookingRulesSettings: React.FC<Props> = ({
  openingHourOptions,
  closingHourOptions,
  settingsForm,
  setSettingsForm,
  settingsSaving,
  saveSettings,
}) => (
  <Paper sx={{ p: 3 }} elevation={0}>
    <Stack direction="column" spacing={2}>
      <Typography variant="h4" component="h2">
        Bookingregler
      </Typography>
      <Typography>
        Konfigurer varighet, granularitet og åpningstider som styrer hvilke tider som kan bookes i JanHus.
      </Typography>

      <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr 1fr" }}>
        <TextField
          label="Minimum varighet (min)"
          type="number"
          value={settingsForm.minDurationMinutes}
          onChange={(event) => setSettingsForm((prev) => ({ ...prev, minDurationMinutes: Number(event.target.value) }))}
        />
        <TextField
          label="Granularitet (min)"
          type="number"
          value={settingsForm.slotGranularityMinutes}
          onChange={(event) =>
            setSettingsForm((prev) => ({ ...prev, slotGranularityMinutes: Number(event.target.value) }))
          }
        />
        <TextField
          label="Buffer (min)"
          type="number"
          value={settingsForm.bufferMinutes}
          onChange={(event) => setSettingsForm((prev) => ({ ...prev, bufferMinutes: Number(event.target.value) }))}
        />
        <FormControl>
          <InputLabel>Åpningstime</InputLabel>
          <Select
            label="Åpningstime"
            value={settingsForm.openingHour}
            onChange={(event) => setSettingsForm((prev) => ({ ...prev, openingHour: Number(event.target.value) }))}
          >
            {openingHourOptions.map((value) => (
              <MenuItem key={value} value={value}>
                {value.toString().padStart(2, "0")}:00
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Stengetime</InputLabel>
          <Select
            label="Stengetime"
            value={settingsForm.closingHour}
            onChange={(event) => setSettingsForm((prev) => ({ ...prev, closingHour: Number(event.target.value) }))}
          >
            {closingHourOptions.map((option) => (
              <MenuItem key={`${option.value}-${option.label}`} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Forenings bookinger åpner (uker før):"
          type="number"
          value={settingsForm.organizationBookingOpensWeeksBefore}
          onChange={(event) =>
            setSettingsForm((prev) => ({
              ...prev,
              organizationBookingOpensWeeksBefore: Number(event.target.value),
            }))
          }
        />
        <TextField
          label="Personlige bookinger åpner (uker før):"
          type="number"
          value={settingsForm.generalBookingOpensWeeksBefore}
          onChange={(event) =>
            setSettingsForm((prev) => ({
              ...prev,
              generalBookingOpensWeeksBefore: Number(event.target.value),
            }))
          }
        />
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={settingsForm.externalBookingsEnabled}
            onChange={(event) =>
              setSettingsForm((prev) => ({ ...prev, externalBookingsEnabled: event.target.checked }))
            }
          />
        }
        label="Tillat eksterne bookingforespørsler"
      />

      <FormControlLabel
        control={
          <Switch
            checked={settingsForm.privateBookingsEnabled}
            onChange={(event) => setSettingsForm((prev) => ({ ...prev, privateBookingsEnabled: event.target.checked }))}
          />
        }
        label="Tillat private bookingforespørsler"
      />

      <FormControlLabel
        control={
          <Switch
            checked={settingsForm.cleaningOptionEnabled}
            onChange={(event) => setSettingsForm((prev) => ({ ...prev, cleaningOptionEnabled: event.target.checked }))}
          />
        }
        label="Tillat valg av innleid renhold"
      />

      <Box>
        <Button variant="contained" onClick={saveSettings} disabled={settingsSaving}>
          Lagre regler
        </Button>
      </Box>
    </Stack>
  </Paper>
);
