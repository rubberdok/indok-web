import {
  Alert,
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import { DOOR_ACCESS_POLICY_LABELS, ORGANIZATION_DOOR_ACCESS_LABELS } from "@/components/pages/janhus/constants";

import { PickedUser, UserPicker } from "./UserPicker";

export type DoorAccessEdit = {
  doorAccessPolicy: string;
  organizationDoorAccess: string;
  bookerUser: PickedUser | null;
  responsibleUser: PickedUser | null;
};

type Props = {
  value: DoorAccessEdit;
  onChange: (patch: Partial<DoorAccessEdit>) => void;
  isOrganizationBooking: boolean;
  /** From the saved booking: why the booker would not get the door. */
  warnings: readonly string[];
  readOnly: boolean;
};

/**
 * Who opens the JanHus door for a confirmed booking. The door sync (apps.arx) reads exactly these
 * fields. Options that need a website user are disabled until one is linked by search.
 */
export const DoorAccessFields: React.FC<Props> = ({ value, onChange, isOrganizationBooking, warnings, readOnly }) => {
  const bookerOnly = value.organizationDoorAccess === "BOOKER_ONLY";

  return (
    <Stack spacing={1.5}>
      <Box>
        <Typography variant="subtitle2">Dørtilgang på JanHus</Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Gjelder bare når bookingen er bekreftet.
        </Typography>
      </Box>
      {warnings.map((warning) => (
        <Alert key={warning} severity="warning">
          {warning}
        </Alert>
      ))}
      <Box display="grid" gap={1.5} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
        {isOrganizationBooking ? (
          <>
            <FormControl disabled={readOnly}>
              <InputLabel>Bestiller for organisasjonen</InputLabel>
              <Select
                label="Bestiller for organisasjonen"
                value={value.organizationDoorAccess}
                onChange={(event) => onChange({ organizationDoorAccess: event.target.value })}
              >
                {Object.entries(ORGANIZATION_DOOR_ACCESS_LABELS).map(([option, label]) => (
                  <MenuItem key={option} value={option} disabled={option === "BOOKER_ONLY" && !value.bookerUser}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {value.bookerUser
                  ? "Ledere får tilgang, eller bare den som bestilte."
                  : "«Kun personen som bestilte» krever at bestilleren er en bruker på nettsiden."}
              </FormHelperText>
            </FormControl>
            <UserPicker
              label="Bestiller på nettsiden"
              value={value.bookerUser}
              disabled={readOnly}
              helperText="Kontoen som bestilte. Brukes også hvis organisasjonen ikke har ledere."
              onChange={(bookerUser) =>
                onChange(bookerUser || !bookerOnly ? { bookerUser } : { bookerUser, organizationDoorAccess: "LEADERS" })
              }
            />
          </>
        ) : null}
        <UserPicker
          label="Ansvarlig på nettsiden"
          value={value.responsibleUser}
          disabled={readOnly}
          helperText="Søk opp ansvarlig for å kunne gi dørtilgang."
          onChange={(responsibleUser) =>
            onChange(
              responsibleUser || value.doorAccessPolicy !== "BOOKER_AND_RESPONSIBLE"
                ? { responsibleUser }
                : { responsibleUser, doorAccessPolicy: "BOOKER_ONLY" }
            )
          }
        />
        <FormControl disabled={readOnly}>
          <InputLabel>Åpningspolicy</InputLabel>
          <Select
            label="Åpningspolicy"
            value={value.doorAccessPolicy}
            onChange={(event) => onChange({ doorAccessPolicy: event.target.value })}
          >
            {Object.entries(DOOR_ACCESS_POLICY_LABELS).map(([option, label]) => (
              <MenuItem
                key={option}
                value={option}
                disabled={option === "BOOKER_AND_RESPONSIBLE" && !value.responsibleUser}
              >
                {label}
              </MenuItem>
            ))}
          </Select>
          {value.doorAccessPolicy !== "BOOKER_ONLY" && !value.responsibleUser ? (
            <FormHelperText>Ansvarlig er ikke en bruker på nettsiden og får ikke dørtilgang.</FormHelperText>
          ) : null}
          {isOrganizationBooking && value.doorAccessPolicy === "ALL_PARTICIPANTS" ? (
            <FormHelperText>Alle medlemmer av organisasjonen regnes med i gjestelisten.</FormHelperText>
          ) : null}
        </FormControl>
      </Box>
    </Stack>
  );
};
