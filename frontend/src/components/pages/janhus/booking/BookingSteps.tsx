import { KeyboardArrowRight, Send } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
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
import { useState } from "react";

import { Calendar } from "@/components/Calendar";
import { useStepContext } from "@/components/pages/cabins/booking/StepContext";
import { Stepper as BookingStepNavigation } from "@/components/pages/cabins/booking/Steps/Stepper";
import dayjs from "@/lib/date";

export type JanHusOwnerType = "PERSONAL" | "ORGANIZATION" | "EXTERNAL";

type SelectOption = {
  value: string;
  label: string;
};

type OrganizationOption = {
  id: string;
  name: string;
};

type Props = {
  bookingDate: dayjs.Dayjs | undefined;
  startsAt: string;
  endsAt: string;
  area: string;
  areaOptions: SelectOption[];
  startOptions: SelectOption[];
  endOptions: SelectOption[];
  minDurationMinutes: number;
  slotGranularityMinutes: number;
  openingHour: number;
  closingHour: number;
  selectedDurationMinutes: number | undefined;

  ownerType: JanHusOwnerType;
  organizationId: string;
  organizations: OrganizationOption[];
  canCreateNonExternalBooking: boolean;
  externalBookingsEnabled: boolean;
  isAuthenticated: boolean;
  isIndokStudent: boolean;

  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  hasDifferentResponsible: boolean;
  responsibleName: string;
  responsibleEmail: string;
  responsiblePhone: string;

  eventType: string;
  eventTypeOptions: SelectOption[];

  comment: string;
  guestListEntries: string[];
  cleaningRequested: boolean;
  acceptedGuidelines: boolean;
  acceptedContractPlaceholder: boolean;

  selectedAreaLabel: string;
  loading: boolean;
  submittedBookingRequestId: string | undefined;
  isBookingDateDisabled: (date: dayjs.Dayjs) => boolean;

  onAreaChange: (value: string) => void;
  onBookingDateChange: (value: dayjs.Dayjs) => void;
  onStartsAtChange: (value: string) => void;
  onEndsAtChange: (value: string) => void;

  onOwnerTypeChange: (value: JanHusOwnerType) => void;
  onOrganizationChange: (value: string) => void;

  onRequesterNameChange: (value: string) => void;
  onRequesterEmailChange: (value: string) => void;
  onRequesterPhoneChange: (value: string) => void;
  onHasDifferentResponsibleChange: (value: boolean) => void;
  onResponsibleNameChange: (value: string) => void;
  onResponsibleEmailChange: (value: string) => void;
  onResponsiblePhoneChange: (value: string) => void;

  onEventTypeChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onCleaningRequestedChange: (value: boolean) => void;
  onAcceptedGuidelinesChange: (value: boolean) => void;
  onAcceptedContractPlaceholderChange: (value: boolean) => void;

  onOpenGuestListDialog: () => void;

  onBookingStepNext: () => void;
  onContactStepNext: () => void;
  onContractStepNext: () => void;
  onSubmitBooking: () => Promise<void>;
};

export const BookingSteps: React.FC<Props> = ({
  bookingDate,
  startsAt,
  endsAt,
  area,
  areaOptions,
  startOptions,
  endOptions,
  minDurationMinutes,
  slotGranularityMinutes,
  openingHour,
  closingHour,
  selectedDurationMinutes,
  ownerType,
  organizationId,
  organizations,
  canCreateNonExternalBooking,
  externalBookingsEnabled,
  isAuthenticated,
  isIndokStudent,
  requesterName,
  requesterEmail,
  requesterPhone,
  hasDifferentResponsible,
  responsibleName,
  responsibleEmail,
  responsiblePhone,
  eventType,
  eventTypeOptions,
  comment,
  guestListEntries,
  cleaningRequested,
  acceptedGuidelines,
  acceptedContractPlaceholder,
  selectedAreaLabel,
  loading,
  submittedBookingRequestId,
  isBookingDateDisabled,
  onAreaChange,
  onBookingDateChange,
  onStartsAtChange,
  onEndsAtChange,
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
  onCommentChange,
  onCleaningRequestedChange,
  onAcceptedGuidelinesChange,
  onAcceptedContractPlaceholderChange,
  onOpenGuestListDialog,
  onBookingStepNext,
  onContactStepNext,
  onContractStepNext,
  onSubmitBooking,
}) => {
  const { activeStep } = useStepContext();
  const [confirmOpen, setConfirmOpen] = useState(false);

  switch (activeStep) {
    case 0:
      return (
        <Paper sx={{ p: 3, bgcolor: "background.elevated" }} elevation={0}>
          <Stack spacing={2}>
            <Typography variant="body1" color="text.secondary">
              Flyt: velg område, velg dato i kalender, og velg et ledig tidsrom.
            </Typography>

            <Alert severity="info">
              Regler: minimum {minDurationMinutes} minutter, granularitet {slotGranularityMinutes} minutter, åpningstid{" "}
              {openingHour}:00–{closingHour}:00.
            </Alert>

            {startsAt && endsAt && selectedDurationMinutes ? (
              <Alert severity="success">
                Valgt tidsrom: {dayjs(startsAt).format("DD.MM.YYYY HH:mm")} – {dayjs(endsAt).format("DD.MM.YYYY HH:mm")}{" "}
                ({selectedDurationMinutes} min)
              </Alert>
            ) : null}

            <Typography variant="h5">1) Velg område</Typography>
            <FormControl fullWidth>
              <InputLabel>Område</InputLabel>
              <Select value={area} label="Område" onChange={(event) => onAreaChange(event.target.value)}>
                {areaOptions.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h5">2) Velg dato</Typography>
            <Calendar
              title="Kalender"
              onDateClick={(date) => onBookingDateChange(date.startOf("day"))}
              startDate={bookingDate}
              endDate={bookingDate}
              isDateDisabled={isBookingDateDisabled}
            />

            <Divider />

            <Typography variant="h5">3) Velg ledig tidsrom</Typography>
            <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
              <FormControl>
                <InputLabel>Starttid</InputLabel>
                <Select
                  value={startsAt}
                  label="Starttid"
                  onChange={(event) => onStartsAtChange(event.target.value)}
                  disabled={!bookingDate || startOptions.length === 0}
                >
                  {startOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {!bookingDate
                    ? "Velg dato i kalenderen for å vise starttider."
                    : startOptions.length === 0
                      ? "Ingen ledige starttider på valgt dato/område."
                      : "Viser kun tider som har minst én gyldig og ledig sluttid."}
                </FormHelperText>
              </FormControl>

              <FormControl>
                <InputLabel>Sluttid</InputLabel>
                <Select
                  value={endsAt}
                  label="Sluttid"
                  onChange={(event) => onEndsAtChange(event.target.value)}
                  disabled={!startsAt || endOptions.length === 0}
                >
                  {endOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {!startsAt
                    ? `Velg starttid først (minst ${minDurationMinutes} min varighet).`
                    : endOptions.length === 0
                      ? "Ingen gyldige ledige sluttider for valgt starttid."
                      : "Sluttid må følge granularitet og være ledig."}
                </FormHelperText>
              </FormControl>
            </Box>

            <BookingStepNavigation
              nextButton={
                <Button variant="contained" endIcon={<KeyboardArrowRight />} onClick={onBookingStepNext}>
                  Neste
                </Button>
              }
            />
          </Stack>
        </Paper>
      );

    case 1:
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
                {canCreateNonExternalBooking ? <MenuItem value="PERSONAL">Personlig booking</MenuItem> : null}
                {canCreateNonExternalBooking && organizations.length > 0 ? (
                  <MenuItem value="ORGANIZATION">Booking på vegne av organisasjon</MenuItem>
                ) : null}
                {externalBookingsEnabled || !isAuthenticated || !isIndokStudent ? (
                  <MenuItem value="EXTERNAL" disabled={!externalBookingsEnabled}>
                    Ekstern forespørsel
                  </MenuItem>
                ) : null}
              </Select>
              {!externalBookingsEnabled ? (
                <FormHelperText>Eksterne forespørsler er midlertidig deaktivert i innstillinger.</FormHelperText>
              ) : !canCreateNonExternalBooking ? (
                <FormHelperText>Kun eksterne forespørsler er tilgjengelig for ikke Indøk studenter.</FormHelperText>
              ) : null}
            </FormControl>

            {ownerType === "ORGANIZATION" ? (
              <FormControl>
                <InputLabel>Organisasjon</InputLabel>
                <Select
                  value={organizationId}
                  label="Organisasjon"
                  onChange={(event) => onOrganizationChange(event.target.value)}
                >
                  {organizations.map((organization) => (
                    <MenuItem key={organization.id} value={organization.id}>
                      {organization.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}

            <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
              <TextField
                label="Navn på bestiller"
                value={requesterName}
                onChange={(event) => onRequesterNameChange(event.target.value)}
                required
              />
              <TextField
                label="E-post bestiller"
                type="email"
                value={requesterEmail}
                onChange={(event) => onRequesterEmailChange(event.target.value)}
                required
              />
              <TextField
                label="Telefon bestiller"
                value={requesterPhone}
                onChange={(event) => onRequesterPhoneChange(event.target.value)}
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
                  required
                />
                <TextField
                  label="Ansvarlig e-post"
                  type="email"
                  value={responsibleEmail}
                  onChange={(event) => onResponsibleEmailChange(event.target.value)}
                  required
                />
                <TextField
                  label="Ansvarlig telefon"
                  value={responsiblePhone}
                  onChange={(event) => onResponsiblePhoneChange(event.target.value)}
                  required
                />
              </Box>
            ) : null}

            {ownerType === "EXTERNAL" ? (
              <TextField
                label="Arrangementstype"
                value="Ekstern"
                disabled
                helperText="Eksterne forespørsler settes alltid som ekstern hendelse. Logg inn for interne/private valg."
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

    case 2:
      return (
        <Paper sx={{ p: 3, bgcolor: "background.elevated" }} elevation={0}>
          <Stack spacing={2}>
            <Typography variant="h5">Ekstra info</Typography>

            <TextField
              label="Kommentar"
              multiline
              minRows={3}
              value={comment}
              onChange={(event) => onCommentChange(event.target.value)}
            />

            <Stack spacing={1}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
                <Button variant="outlined" onClick={onOpenGuestListDialog}>
                  Rediger gjesteliste
                </Button>
                <Typography variant="body2" color="text.secondary">
                  {guestListEntries.length > 0
                    ? `Registrerte gjester: ${guestListEntries.length}`
                    : "Ingen gjester registrert ennå"}
                </Typography>
              </Stack>

              {guestListEntries.length > 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {guestListEntries.join(", ")}
                </Typography>
              ) : null}
            </Stack>

            <FormControlLabel
              control={
                <Checkbox
                  checked={cleaningRequested}
                  onChange={(event) => onCleaningRequestedChange(event.target.checked)}
                />
              }
              label="Ønsker innleid renhold (kostnad kommer i etterkant)"
            />

            <BookingStepNavigation />
          </Stack>
        </Paper>
      );

    case 3:
      return (
        <Paper sx={{ p: 3, bgcolor: "background.elevated" }} elevation={0}>
          <Stack spacing={2}>
            <Typography variant="h5">Kontrakt og retningslinjer</Typography>

            <Alert severity="info">
              <Typography variant="subtitle2" gutterBottom>
                JanHus retningslinjer
              </Typography>
              Følg alltid gjeldende regler for bruk av JanHus. Endelig versjon av retningslinjene publiseres før endelig
              bekreftelse av bookingen.
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

            <Alert severity="warning">
              <Typography variant="subtitle2" gutterBottom>
                Kontrakt (foreløpig)
              </Typography>
              Dette er en midlertidig plassholder for semikontrakt i bookingflyten. Endelig kontraktstekst legges inn
              før produksjonssetting.
            </Alert>

            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedContractPlaceholder}
                  onChange={(event) => onAcceptedContractPlaceholderChange(event.target.checked)}
                />
              }
              label="Jeg forstår kontraktsgrunnlaget (foreløpig versjon)"
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

    case 4:
      return (
        <>
          {confirmOpen ? (
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
              <DialogContent>Er du sikker på at du vil sende denne bookingforespørselen?</DialogContent>
              <DialogActions>
                <Button color="inherit" variant="outlined" onClick={() => setConfirmOpen(false)}>
                  Avbryt
                </Button>
                <Button
                  endIcon={<Send />}
                  variant="contained"
                  onClick={async () => {
                    await onSubmitBooking();
                    setConfirmOpen(false);
                  }}
                  disabled={loading}
                >
                  Send
                </Button>
              </DialogActions>
            </Dialog>
          ) : null}

          <Paper sx={{ p: 3, bgcolor: "background.elevated" }} elevation={0}>
            <Stack spacing={2}>
              <Typography variant="h5">Se over og send søknad</Typography>

              <Typography variant="body1">
                <strong>Område:</strong> {selectedAreaLabel}
              </Typography>
              <Typography variant="body1">
                <strong>Tidsrom:</strong> {startsAt ? dayjs(startsAt).format("DD.MM.YYYY HH:mm") : "-"} –{" "}
                {endsAt ? dayjs(endsAt).format("DD.MM.YYYY HH:mm") : "-"}
              </Typography>
              <Typography variant="body1">
                <strong>Bestiller:</strong> {requesterName || "-"} ({requesterEmail || "-"})
              </Typography>
              <Typography variant="body1">
                <strong>Telefon:</strong> {requesterPhone || "-"}
              </Typography>
              <Typography variant="body1">
                <strong>Eiertype:</strong> {ownerType}
              </Typography>
              <Typography variant="body1">
                <strong>Arrangementstype:</strong> {ownerType === "EXTERNAL" ? "EXTERNAL" : eventType}
              </Typography>
              <Typography variant="body1">
                <strong>Renhold:</strong> {cleaningRequested ? "Ja" : "Nei"}
              </Typography>
              <Typography variant="body1">
                <strong>Gjesteliste:</strong>{" "}
                {guestListEntries.length > 0 ? `${guestListEntries.length} registrerte` : "Ingen"}
              </Typography>
              {comment ? (
                <Typography variant="body1">
                  <strong>Kommentar:</strong> {comment}
                </Typography>
              ) : null}

              <BookingStepNavigation
                nextButton={
                  <Button
                    variant="contained"
                    endIcon={<Send />}
                    onClick={() => setConfirmOpen(true)}
                    disabled={loading}
                  >
                    Send søknad
                  </Button>
                }
              />
            </Stack>
          </Paper>
        </>
      );

    case 5:
      return (
        <Paper sx={{ p: 3, bgcolor: "background.elevated" }} elevation={0}>
          <Stack spacing={2}>
            <Typography variant="h4">Kvittering</Typography>
            <Typography variant="body1">Din bookingforespørsel er sendt til Janus Eiendom.</Typography>
            <Typography variant="body1">
              <strong>Booking-ID:</strong> {submittedBookingRequestId ?? "Ikke tilgjengelig"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Du får oppfølging på e-post når forespørselen er behandlet.
            </Typography>
          </Stack>
        </Paper>
      );

    default:
      return <Typography>Step not found</Typography>;
  }
};
