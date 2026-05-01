import { useMutation, useQuery } from "@apollo/client";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
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
import { useCallback, useEffect, useMemo, useState } from "react";

import { Calendar } from "@/components/Calendar";
import { GuestListDialog, JanHusGuestListEntry } from "@/components/pages/janhus/GuestListDialog";
import { Title } from "@/components/Title";
import {
  CreateJanhusBookingRequestDocument,
  JanHusAreaConfigurationsDocument,
  JanHusBookingsDocument,
  JanHusBookingSettingsDocument,
  UserOrganizationsDocument,
} from "@/generated/graphql";
import { Layout } from "@/layouts/Layout";
import dayjs from "@/lib/date";
import { NextPageWithLayout } from "@/lib/next";

type OwnerType = "PERSONAL" | "ORGANIZATION" | "EXTERNAL";

const DEFAULT_SETTINGS = {
  minDurationMinutes: 60,
  slotGranularityMinutes: 30,
  openingHour: 8,
  closingHour: 2,
};

const AREA_LABELS: Record<string, string> = {
  FIRST_FLOOR: "1. etasje",
  SECOND_FLOOR: "2. etasje",
  ENTIRE_HOUSE: "Hele huset",
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  INTERNAL: "Intern",
  OPEN_FOR_INDOK: "Åpent for Indøk-studenter",
  PRIVATE: "Privat",
};

const NORWEGIAN_PHONE_REGEX = /^(0047|\+47|47)?[49]\d{7}$/;

const normalizePhoneNumber = (value: string) => value.replace(/\s/g, "");

const toManualGuestEntry = (displayName: string): JanHusGuestListEntry => ({
  feideUserId: `manual:${displayName.trim().toLowerCase().replace(/\s+/g, "-")}`,
  displayName: displayName.trim(),
});

const formatSubmissionError = (rawMessage: string) => {
  const fieldLabelMap: Record<string, string> = {
    requester_email: "E-post bestiller",
    responsible_email: "E-post ansvarlig",
    requester_phone: "Telefon bestiller",
    responsible_phone: "Telefon ansvarlig",
  };

  if (rawMessage.includes('null value in column "responsible_first_name"')) {
    return "Kunne ikke sende forespørselen på grunn av en midlertidig serverfeil. Prøv igjen om noen sekunder.";
  }

  const parsedFieldErrors = Array.from(rawMessage.matchAll(/'([^']+)'\s*:\s*\['([^']+)'\]/g)).map(
    ([, field, message]) => ({ field, message })
  );

  if (parsedFieldErrors.length > 0) {
    return parsedFieldErrors
      .map(({ field, message }) => {
        const readableField = fieldLabelMap[field] ?? field;
        const readableMessage = message === "Enter a valid email address." ? "Ugyldig e-postadresse." : message;
        return `${readableField}: ${readableMessage}`;
      })
      .join(" ");
  }

  return rawMessage;
};

const getConflictingAreas = (area: string) => {
  if (area === "ENTIRE_HOUSE") {
    return ["ENTIRE_HOUSE", "FIRST_FLOOR", "SECOND_FLOOR"];
  }
  if (area === "FIRST_FLOOR") {
    return ["FIRST_FLOOR", "ENTIRE_HOUSE"];
  }
  return ["SECOND_FLOOR", "ENTIRE_HOUSE"];
};

const formatSlotLabel = (slot: dayjs.Dayjs, baseDay?: dayjs.Dayjs) => {
  const nextDay = baseDay ? !slot.isSame(baseDay, "day") : false;
  return `${slot.format("HH:mm")}${nextDay ? " (+1 dag)" : ""}`;
};

const JanHusBookingPage: NextPageWithLayout = () => {
  const [bookingDate, setBookingDate] = useState<dayjs.Dayjs | undefined>();
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [area, setArea] = useState("FIRST_FLOOR");

  const [ownerType, setOwnerType] = useState<OwnerType>("EXTERNAL");
  const [organizationId, setOrganizationId] = useState("");

  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterPhone, setRequesterPhone] = useState("");
  const [hasDifferentResponsible, setHasDifferentResponsible] = useState(false);

  const [responsibleName, setResponsibleName] = useState("");
  const [responsibleEmail, setResponsibleEmail] = useState("");
  const [responsiblePhone, setResponsiblePhone] = useState("");

  const [eventType, setEventType] = useState("INTERNAL");
  const [cleaningRequested, setCleaningRequested] = useState(false);
  const [comment, setComment] = useState("");
  const [guestList, setGuestList] = useState("");
  const [isGuestListDialogOpen, setIsGuestListDialogOpen] = useState(false);
  const [acceptedGuidelines, setAcceptedGuidelines] = useState(false);
  const [acceptedContractPlaceholder, setAcceptedContractPlaceholder] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const { data: settingsData } = useQuery(JanHusBookingSettingsDocument);
  const { data: areasData } = useQuery(JanHusAreaConfigurationsDocument);
  const { data: orgData } = useQuery(UserOrganizationsDocument, {
    fetchPolicy: "cache-and-network",
  });

  const [createBookingRequest, { loading }] = useMutation(CreateJanhusBookingRequestDocument, {
    onCompleted: () => {
      setSuccessMessage("Forespørsel sendt! Janus Eiendom vil følge opp.");
      setErrorMessage(undefined);

      setEndsAt("");
      setComment("");
      setCleaningRequested(false);
      setGuestList("");
    },
    onError: (error) => {
      setErrorMessage(formatSubmissionError(error.message));
      setSuccessMessage(undefined);
    },
  });

  const hasResolvedUser = orgData !== undefined;
  const isAuthenticated = Boolean(orgData?.user);
  const isIndokStudent = orgData?.user?.isIndok ?? false;
  const canCreateNonExternalBooking = isAuthenticated && isIndokStudent;
  const organizations = useMemo(() => orgData?.user?.organizations ?? [], [orgData]);
  const areaConfigurations = areasData?.janhusAreaConfigurations ?? [];

  const bookingSettings = settingsData?.janhusBookingSettings ?? DEFAULT_SETTINGS;
  const externalBookingsEnabled = settingsData?.janhusBookingSettings?.externalBookingsEnabled ?? true;
  const minDurationMinutes = Math.max(bookingSettings.minDurationMinutes, 1);
  const slotGranularityMinutes = Math.max(bookingSettings.slotGranularityMinutes, 1);
  const openingHour = bookingSettings.openingHour;
  const closingHour = bookingSettings.closingHour;

  const bookingDay = useMemo(() => {
    if (!bookingDate) {
      return undefined;
    }

    return bookingDate.tz("Europe/Oslo").startOf("day");
  }, [bookingDate]);

  const bookingWindow = useMemo(() => {
    if (!bookingDay) {
      return undefined;
    }

    const windowStart = bookingDay.hour(openingHour).minute(0).second(0).millisecond(0);
    let windowEnd = bookingDay.hour(closingHour).minute(0).second(0).millisecond(0);

    if (openingHour >= closingHour) {
      windowEnd = windowEnd.add(1, "day");
    }

    return { windowStart, windowEnd };
  }, [bookingDay, closingHour, openingHour]);

  const { data: overlappingBookingsData } = useQuery(JanHusBookingsDocument, {
    skip: !bookingWindow,
    variables: bookingWindow
      ? {
          startsAt: bookingWindow.windowStart.toISOString(),
          endsAt: bookingWindow.windowEnd.toISOString(),
        }
      : undefined,
    fetchPolicy: "cache-and-network",
  });

  const overlappingBookings = useMemo(() => overlappingBookingsData?.janhusBookings ?? [], [overlappingBookingsData]);

  const relevantBookings = useMemo(() => {
    const conflictingAreas = getConflictingAreas(area);
    return overlappingBookings
      .filter((booking) => conflictingAreas.includes(booking.area))
      .map((booking) => ({
        startsAt: dayjs(booking.startsAt),
        endsAt: dayjs(booking.endsAt),
      }));
  }, [area, overlappingBookings]);

  const hasOverlap = useCallback(
    (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
      return relevantBookings.some((booking) => booking.startsAt.isBefore(end) && booking.endsAt.isAfter(start));
    },
    [relevantBookings]
  );

  const timeBoundaries = useMemo(() => {
    if (!bookingWindow) {
      return [];
    }

    const boundaries = [bookingWindow.windowStart];
    let current = bookingWindow.windowStart;

    while (current.add(slotGranularityMinutes, "minute").isSameOrBefore(bookingWindow.windowEnd)) {
      const next = current.add(slotGranularityMinutes, "minute");
      boundaries.push(next);
      current = next;
    }

    if (!boundaries[boundaries.length - 1].isSame(bookingWindow.windowEnd)) {
      boundaries.push(bookingWindow.windowEnd);
    }

    return boundaries;
  }, [bookingWindow, slotGranularityMinutes]);

  const possibleEndOptionsFor = useCallback(
    (start: dayjs.Dayjs) => {
      return timeBoundaries
        .filter(
          (slot) =>
            slot.isAfter(start) &&
            slot.diff(start, "minute") >= minDurationMinutes &&
            slot.diff(start, "minute") % slotGranularityMinutes === 0 &&
            !hasOverlap(start, slot)
        )
        .map((slot) => ({
          value: slot.toISOString(),
          label: formatSlotLabel(slot, bookingDay),
        }));
    },
    [bookingDay, hasOverlap, minDurationMinutes, slotGranularityMinutes, timeBoundaries]
  );

  const startOptions = useMemo(() => {
    return timeBoundaries
      .slice(0, -1)
      .filter((slot) => possibleEndOptionsFor(slot).length > 0)
      .map((slot) => ({
        value: slot.toISOString(),
        label: formatSlotLabel(slot, bookingDay),
      }));
  }, [bookingDay, possibleEndOptionsFor, timeBoundaries]);

  const endOptions = useMemo(() => {
    if (!startsAt) {
      return [];
    }

    const selectedStart = dayjs(startsAt);

    return possibleEndOptionsFor(selectedStart);
  }, [startsAt, possibleEndOptionsFor]);

  const selectedDurationMinutes = useMemo(() => {
    if (!startsAt || !endsAt) {
      return undefined;
    }

    return dayjs(endsAt).diff(dayjs(startsAt), "minute");
  }, [endsAt, startsAt]);

  const guestListEntries = useMemo(
    () =>
      guestList
        .split(/\r?\n/)
        .map((entry) => entry.trim())
        .filter(Boolean),
    [guestList]
  );

  const guestListDialogEntries = useMemo(() => {
    const seenGuestNames = new Set<string>();

    return guestListEntries
      .filter((entry) => {
        const normalizedEntry = entry.toLowerCase();
        if (seenGuestNames.has(normalizedEntry)) {
          return false;
        }
        seenGuestNames.add(normalizedEntry);
        return true;
      })
      .map((entry) => toManualGuestEntry(entry));
  }, [guestListEntries]);

  const openGuestListDialog = useCallback(() => {
    setIsGuestListDialogOpen(true);
  }, []);

  const closeGuestListDialog = useCallback(() => {
    setIsGuestListDialogOpen(false);
  }, []);

  const saveGuestList = useCallback((selectedGuests: JanHusGuestListEntry[]) => {
    const seenGuestNames = new Set<string>();
    const normalizedGuestList = selectedGuests
      .map((guest) => guest.displayName.trim())
      .filter((guestName) => {
        if (!guestName) {
          return false;
        }

        const normalizedGuestName = guestName.toLowerCase();
        if (seenGuestNames.has(normalizedGuestName)) {
          return false;
        }

        seenGuestNames.add(normalizedGuestName);
        return true;
      })
      .join("\n");

    setGuestList(normalizedGuestList);
    setIsGuestListDialogOpen(false);
  }, []);

  useEffect(() => {
    if (!hasResolvedUser) {
      return;
    }

    if (!canCreateNonExternalBooking) {
      if (ownerType !== "EXTERNAL") {
        setOwnerType("EXTERNAL");
      }
      return;
    }
  }, [canCreateNonExternalBooking, hasResolvedUser, ownerType]);

  useEffect(() => {
    if (ownerType === "ORGANIZATION" && organizations.length === 0) {
      setOwnerType(isAuthenticated ? "PERSONAL" : "EXTERNAL");
      return;
    }

    if (ownerType !== "ORGANIZATION" && organizationId) {
      setOrganizationId("");
    }
  }, [isAuthenticated, organizationId, organizations, ownerType]);

  useEffect(() => {
    if (ownerType === "ORGANIZATION" && !organizationId && organizations.length > 0) {
      setOrganizationId(organizations[0].id);
    }
  }, [organizationId, organizations, ownerType]);

  useEffect(() => {
    setStartsAt("");
    setEndsAt("");
  }, [bookingDate, area]);

  useEffect(() => {
    if (startsAt && !startOptions.some((option) => option.value === startsAt)) {
      setStartsAt("");
      setEndsAt("");
    }
  }, [startsAt, startOptions]);

  useEffect(() => {
    if (endsAt && !endOptions.some((option) => option.value === endsAt)) {
      setEndsAt("");
    }
  }, [endsAt, endOptions]);

  useEffect(() => {
    if (!hasDifferentResponsible) {
      setResponsibleName("");
      setResponsibleEmail("");
      setResponsiblePhone("");
    }
  }, [hasDifferentResponsible]);

  async function handleSubmit() {
    setErrorMessage(undefined);
    setSuccessMessage(undefined);

    if (!bookingDate || !startsAt || !endsAt) {
      setErrorMessage("Velg område, dato og gyldig tidsrom.");
      return;
    }

    if (!requesterName || !requesterEmail || !requesterPhone) {
      setErrorMessage("Fyll ut bestillerinformasjon.");
      return;
    }

    const normalizedRequesterPhone = normalizePhoneNumber(requesterPhone);
    const normalizedResponsiblePhone = normalizePhoneNumber(
      hasDifferentResponsible ? responsiblePhone : requesterPhone
    );

    if (!NORWEGIAN_PHONE_REGEX.test(normalizedRequesterPhone)) {
      setErrorMessage("Telefon bestiller må være et gyldig norsk telefonnummer.");
      return;
    }

    if (hasDifferentResponsible && (!responsibleName || !responsibleEmail || !responsiblePhone)) {
      setErrorMessage("Fyll ut ansvarliginformasjon når ansvarlig er en annen person.");
      return;
    }

    if (hasDifferentResponsible && !NORWEGIAN_PHONE_REGEX.test(normalizedResponsiblePhone)) {
      setErrorMessage("Telefon ansvarlig må være et gyldig norsk telefonnummer.");
      return;
    }

    if (!dayjs(endsAt).isAfter(dayjs(startsAt))) {
      setErrorMessage("Sluttid må være etter starttid.");
      return;
    }

    if (!acceptedGuidelines) {
      setErrorMessage("Du må bekrefte at du har lest JanHus retningslinjer.");
      return;
    }

    if (!acceptedContractPlaceholder) {
      setErrorMessage("Du må bekrefte kontraktsgrunnlaget før innsending.");
      return;
    }

    if (ownerType === "ORGANIZATION" && !organizationId) {
      setErrorMessage("Velg organisasjon for booking på vegne av organisasjon.");
      return;
    }

    if (!canCreateNonExternalBooking && ownerType !== "EXTERNAL") {
      setErrorMessage("Kun Indøk-studenter kan sende interne eller personlige JanHus-bookinger.");
      return;
    }

    if (!isAuthenticated && !externalBookingsEnabled) {
      setErrorMessage("Eksterne forespørsler er midlertidig deaktivert.");
      return;
    }

    const resolvedResponsibleName = hasDifferentResponsible ? responsibleName : requesterName;
    const resolvedResponsibleEmail = hasDifferentResponsible ? responsibleEmail : requesterEmail;
    const resolvedResponsiblePhone = normalizedResponsiblePhone;

    await createBookingRequest({
      variables: {
        requestData: {
          startsAt,
          endsAt,
          area,
          ...(ownerType === "ORGANIZATION" && organizationId ? { ownerOrganizationId: organizationId } : {}),
          requesterName,
          requesterEmail,
          requesterPhone: normalizedRequesterPhone,
          responsibleName: resolvedResponsibleName,
          responsibleEmail: resolvedResponsibleEmail,
          responsiblePhone: resolvedResponsiblePhone,
          eventType: ownerType === "EXTERNAL" ? "EXTERNAL" : eventType,
          cleaningRequested,
          comment,
          guestList,
        },
      },
    });
  }

  return (
    <>
      <Title
        title="JanHus booking"
        overline="Booking"
        variant="dark"
        breadcrumbs={[
          {
            name: "Hjem",
            href: "/",
          },
          {
            name: "Booking",
            href: "/booking",
          },
          {
            name: "JanHus",
            href: "/janhus",
          },
          {
            name: "Book",
            href: "/janhus/book",
          },
        ]}
      />
      <Container sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Typography variant="body1" color="text.secondary">
            Flyt: velg område, velg dato i kalender, velg ledig tidsrom, og fyll ut bestillerinformasjon.
          </Typography>

          <Alert severity="info">
            Regler: minimum {minDurationMinutes} minutter, granularitet {slotGranularityMinutes} minutter, åpningstid{" "}
            {openingHour}:00–{closingHour}:00.
          </Alert>

          {startsAt && endsAt && selectedDurationMinutes ? (
            <Alert severity="success">
              Valgt tidsrom: {dayjs(startsAt).format("DD.MM.YYYY HH:mm")} – {dayjs(endsAt).format("DD.MM.YYYY HH:mm")} (
              {selectedDurationMinutes} min)
            </Alert>
          ) : null}

          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

          <Paper sx={{ p: 3, bgcolor: "background.elevated" }} elevation={0}>
            <Stack spacing={2}>
              <Typography variant="h5">1) Velg område</Typography>
              <FormControl fullWidth>
                <InputLabel>Område</InputLabel>
                <Select value={area} label="Område" onChange={(event) => setArea(event.target.value)}>
                  {(areaConfigurations.length
                    ? areaConfigurations.map((configuration) => ({
                        value: configuration.area,
                        label: AREA_LABELS[configuration.area] ?? configuration.area,
                      }))
                    : [
                        { value: "FIRST_FLOOR", label: AREA_LABELS.FIRST_FLOOR },
                        { value: "SECOND_FLOOR", label: AREA_LABELS.SECOND_FLOOR },
                        { value: "ENTIRE_HOUSE", label: AREA_LABELS.ENTIRE_HOUSE },
                      ]
                  ).map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="h5">2) Velg dato</Typography>
              <Calendar
                title="Kalender"
                onDateClick={(date) => setBookingDate(date.startOf("day"))}
                startDate={bookingDate}
                endDate={bookingDate}
                isDateDisabled={(date) => date.isBefore(dayjs().tz("Europe/Oslo"), "day")}
              />

              <Divider />

              <Typography variant="h5">3) Velg ledig tidsrom</Typography>
              <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
                <FormControl>
                  <InputLabel>Starttid</InputLabel>
                  <Select
                    value={startsAt}
                    label="Starttid"
                    onChange={(event) => setStartsAt(event.target.value)}
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
                    onChange={(event) => setEndsAt(event.target.value)}
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
            </Stack>
          </Paper>

          <Paper sx={{ p: 3, bgcolor: "background.elevated" }} elevation={0}>
            <Stack spacing={2}>
              <Typography variant="h5">4) Fyll ut informasjon</Typography>

              <FormControl>
                <InputLabel>Eiertype</InputLabel>
                <Select
                  value={ownerType}
                  label="Eiertype"
                  onChange={(event) => setOwnerType(event.target.value as OwnerType)}
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
                    onChange={(event) => setOrganizationId(event.target.value)}
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
                  onChange={(event) => setRequesterName(event.target.value)}
                  required
                />
                <TextField
                  label="E-post bestiller"
                  type="email"
                  value={requesterEmail}
                  onChange={(event) => setRequesterEmail(event.target.value)}
                  required
                />
                <TextField
                  label="Telefon bestiller"
                  value={requesterPhone}
                  onChange={(event) => setRequesterPhone(event.target.value)}
                  required
                />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasDifferentResponsible}
                    onChange={(event) => setHasDifferentResponsible(event.target.checked)}
                  />
                }
                label="Ansvarlig person er en annen enn bestiller"
              />

              {hasDifferentResponsible ? (
                <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}>
                  <TextField
                    label="Ansvarlig navn"
                    value={responsibleName}
                    onChange={(event) => setResponsibleName(event.target.value)}
                    required
                  />
                  <TextField
                    label="Ansvarlig e-post"
                    type="email"
                    value={responsibleEmail}
                    onChange={(event) => setResponsibleEmail(event.target.value)}
                    required
                  />
                  <TextField
                    label="Ansvarlig telefon"
                    value={responsiblePhone}
                    onChange={(event) => setResponsiblePhone(event.target.value)}
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
                    onChange={(event) => setEventType(event.target.value)}
                  >
                    {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <TextField
                label="Kommentar"
                multiline
                minRows={3}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />

              <Stack spacing={1}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
                  <Button variant="outlined" onClick={openGuestListDialog}>
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
                    onChange={(event) => setCleaningRequested(event.target.checked)}
                  />
                }
                label="Ønsker innleid renhold (kostnad kommer i etterkant)"
              />

              <Alert severity="info">
                <Typography variant="subtitle2" gutterBottom>
                  JanHus retningslinjer
                </Typography>
                Følg alltid gjeldende regler for bruk av JanHus. Endelig versjon av retningslinjene publiseres før
                endelig bekreftelse av bookingen.
              </Alert>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptedGuidelines}
                    onChange={(event) => setAcceptedGuidelines(event.target.checked)}
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
                    onChange={(event) => setAcceptedContractPlaceholder(event.target.checked)}
                  />
                }
                label="Jeg forstår kontraktsgrunnlaget (foreløpig versjon)"
              />

              <Box>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                  Send bookingforespørsel
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Container>

      <GuestListDialog
        open={isGuestListDialogOpen}
        searchMode="request"
        isAuthenticated={isAuthenticated}
        allowManualEntries
        initialGuests={guestListDialogEntries}
        onClose={closeGuestListDialog}
        onSave={saveGuestList}
      />
    </>
  );
};

JanHusBookingPage.getLayout = (page) => <Layout>{page}</Layout>;

export default JanHusBookingPage;
