import { KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Stepper as BookingStepNavigation } from "@/components/pages/cabins/booking/Steps/Stepper";
import { ContactFieldErrors } from "@/components/pages/janhus/validation";

import { JANHUS_OWNER_TYPE_LABELS, type BookingStepsProps, type JanHusOwnerType } from "./types";

const ownerTypeHelperText = (canCreateNonExternal: boolean, organizationCount: number) => {
  if (!canCreateNonExternal) return "Kun eksterne forespørsler er tilgjengelig for ikke Indøk-studenter.";
  if (organizationCount === 0) return "Du må være leder i en forening for å booke på vegne av den.";
  return undefined;
};

type Props = BookingStepsProps & {
  fieldError: (key: keyof ContactFieldErrors) => string | undefined;
  markTouched: (key: string) => void;
};

export const ContactStep: React.FC<Props> = ({
  ownerType,
  organizationId,
  organizations,
  canCreateNonExternalBooking,
  externalBookingsEnabled,
  requesterName,
  requesterEmail,
  requesterPhone,
  hasDifferentResponsible,
  responsibleName,
  responsibleEmail,
  responsiblePhone,
  eventType,
  eventTypeOptions,
  canBookPersonally,
  onOwnerTypeChange,
  onOrganizationChange,
  onRequesterNameChange,
  onRequesterEmailChange,
  onRequesterPhoneChange,
  onHasDifferentResponsibleChange,
  onResponsibleNameChange,
  onResponsibleEmailChange,
  onResponsiblePhoneChange,
  onEventTypeChange,
  onContactStepNext,
  fieldError,
  markTouched,
}) => {
  const ownerHelperText = ownerTypeHelperText(canCreateNonExternalBooking, organizations.length);

  return (
    <Paper sx={{ p: 3, bgcolor: "background.elevated" }} elevation={0}>
      <Stack spacing={2}>
        <Typography variant="h5">Kontaktinfo</Typography>

        <FormControl>
          <InputLabel>Eiertype</InputLabel>
          <Select
            value={ownerType}
            label="Eiertype"
            onChange={(event) => onOwnerTypeChange(event.target.value as JanHusOwnerType)}
          >
            {canBookPersonally ? <MenuItem value="PERSONAL">{JANHUS_OWNER_TYPE_LABELS.PERSONAL}</MenuItem> : null}
            {canCreateNonExternalBooking && organizations.length > 0 ? (
              <MenuItem value="ORGANIZATION">{JANHUS_OWNER_TYPE_LABELS.ORGANIZATION}</MenuItem>
            ) : null}
            {externalBookingsEnabled ? <MenuItem value="EXTERNAL">{JANHUS_OWNER_TYPE_LABELS.EXTERNAL}</MenuItem> : null}
          </Select>
          {ownerHelperText ? <FormHelperText>{ownerHelperText}</FormHelperText> : null}
        </FormControl>

        {ownerType === "ORGANIZATION" ? (
          <FormControl error={Boolean(fieldError("organizationId"))}>
            <InputLabel>Forening</InputLabel>
            <Select
              value={organizationId}
              label="Forening"
              onChange={(event) => onOrganizationChange(event.target.value)}
              onBlur={() => markTouched("organizationId")}
            >
              {organizations.map((organization) => (
                <MenuItem key={organization.id} value={organization.id}>
                  {organization.name}
                </MenuItem>
              ))}
            </Select>
            {fieldError("organizationId") ? <FormHelperText>{fieldError("organizationId")}</FormHelperText> : null}
          </FormControl>
        ) : null}

        <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
          <TextField
            label="Navn på bestiller"
            value={requesterName}
            onChange={(event) => onRequesterNameChange(event.target.value)}
            onBlur={() => markTouched("requesterName")}
            error={Boolean(fieldError("requesterName"))}
            helperText={fieldError("requesterName")}
            required
          />
          <TextField
            label="E-post bestiller"
            type="email"
            value={requesterEmail}
            onChange={(event) => onRequesterEmailChange(event.target.value)}
            onBlur={() => markTouched("requesterEmail")}
            error={Boolean(fieldError("requesterEmail"))}
            helperText={fieldError("requesterEmail")}
            required
          />
          <TextField
            label="Telefon bestiller"
            value={requesterPhone}
            onChange={(event) => onRequesterPhoneChange(event.target.value)}
            onBlur={() => markTouched("requesterPhone")}
            error={Boolean(fieldError("requesterPhone"))}
            helperText={fieldError("requesterPhone")}
            required
          />
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={hasDifferentResponsible}
              onChange={(event) => onHasDifferentResponsibleChange(event.target.checked)}
            />
          }
          label="Ansvarlig person er en annen enn bestiller"
        />

        {hasDifferentResponsible ? (
          <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
            <TextField
              label="Ansvarlig navn"
              value={responsibleName}
              onChange={(event) => onResponsibleNameChange(event.target.value)}
              onBlur={() => markTouched("responsibleName")}
              error={Boolean(fieldError("responsibleName"))}
              helperText={fieldError("responsibleName")}
              required
            />
            <TextField
              label="Ansvarlig e-post"
              type="email"
              value={responsibleEmail}
              onChange={(event) => onResponsibleEmailChange(event.target.value)}
              onBlur={() => markTouched("responsibleEmail")}
              error={Boolean(fieldError("responsibleEmail"))}
              helperText={fieldError("responsibleEmail")}
              required
            />
            <TextField
              label="Ansvarlig telefon"
              value={responsiblePhone}
              onChange={(event) => onResponsiblePhoneChange(event.target.value)}
              onBlur={() => markTouched("responsiblePhone")}
              error={Boolean(fieldError("responsiblePhone"))}
              helperText={fieldError("responsiblePhone")}
              required
            />
          </Box>
        ) : null}

        {ownerType === "EXTERNAL" ? (
          <TextField
            label="Arrangementstype"
            value="Eksternt"
            disabled
            helperText="Eksterne forespørsler settes alltid som ekstern booking. Logg inn for interne/private bookinger."
          />
        ) : (
          <FormControl>
            <InputLabel>Arrangementstype</InputLabel>
            <Select
              value={eventType}
              label="Arrangementstype"
              onChange={(event) => onEventTypeChange(event.target.value)}
            >
              {eventTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <BookingStepNavigation
          nextButton={
            <Button variant="contained" endIcon={<KeyboardArrowRight />} onClick={onContactStepNext}>
              Neste
            </Button>
          }
        />
      </Stack>
    </Paper>
  );
};
