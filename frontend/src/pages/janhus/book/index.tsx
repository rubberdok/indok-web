import { useMutation, useQuery } from "@apollo/client";
import { Alert, Box, Container, Stack, Step, StepLabel, Stepper } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import { StepContext } from "@/components/pages/cabins/booking/StepContext";
import { BookingSteps, JanHusOwnerType } from "@/components/pages/janhus/booking/BookingSteps";
import { GuestListDialog, JanHusGuestListEntry } from "@/components/pages/janhus/GuestListDialog";
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

const steps = ["Book huset", "Kontaktinfo", "Ekstra info", "Kontrakt", "Send søknad", "Kvittering"] as const;

const DEFAULT_SETTINGS = {
  minDurationMinutes: 60,
  slotGranularityMinutes: 30,
  openingHour: 8,
  closingHour: 2,
  fallStartDate: "1970-01-01",
  fallEndDate: "2100-12-31",
  springStartDate: "1970-01-01",
  springEndDate: "2100-12-31",
  fallSemesterActive: true,
  springSemesterActive: true,
  externalBookingsEnabled: true,
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

type SemesterAvailabilitySettings = {
  fallStartDate?: string | null;
  fallEndDate?: string | null;
  springStartDate?: string | null;
  springEndDate?: string | null;
  fallSemesterActive?: boolean | null;
  springSemesterActive?: boolean | null;
};

function isDateInActiveSemester(date: dayjs.Dayjs, bookingSettings: SemesterAvailabilitySettings): boolean {
  const fallStartDate = bookingSettings.fallStartDate ?? DEFAULT_SETTINGS.fallStartDate;
  const fallEndDate = bookingSettings.fallEndDate ?? DEFAULT_SETTINGS.fallEndDate;
  const springStartDate = bookingSettings.springStartDate ?? DEFAULT_SETTINGS.springStartDate;
  const springEndDate = bookingSettings.springEndDate ?? DEFAULT_SETTINGS.springEndDate;
  const fallSemesterActive = bookingSettings.fallSemesterActive ?? DEFAULT_SETTINGS.fallSemesterActive;
  const springSemesterActive = bookingSettings.springSemesterActive ?? DEFAULT_SETTINGS.springSemesterActive;

  const inFallSemester = fallSemesterActive && date.isBetween(fallStartDate, fallEndDate, "day", "[]");

  const inSpringSemester = springSemesterActive && date.isBetween(springStartDate, springEndDate, "day", "[]");

  return inFallSemester || inSpringSemester;
}

const JanHusBookingPage: NextPageWithLayout = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const [bookingDate, setBookingDate] = useState<dayjs.Dayjs | undefined>();
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [area, setArea] = useState("FIRST_FLOOR");

  const [ownerType, setOwnerType] = useState<JanHusOwnerType>("EXTERNAL");
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
  const [submittedBookingRequestId, setSubmittedBookingRequestId] = useState<string | undefined>();

  const { data: settingsData } = useQuery(JanHusBookingSettingsDocument);
  const { data: areasData } = useQuery(JanHusAreaConfigurationsDocument);
  const { data: orgData } = useQuery(UserOrganizationsDocument, {
    fetchPolicy: "cache-and-network",
  });

  const [createBookingRequest, { loading }] = useMutation(CreateJanhusBookingRequestDocument, {
    onCompleted: (data) => {
      setErrorMessage(undefined);
      setSubmittedBookingRequestId(data?.createJanhusBookingRequest?.bookingRequest?.id);
      setActiveStep(steps.length - 1);

      setEndsAt("");
      setComment("");
      setCleaningRequested(false);
      setGuestList("");
    },
    onError: (error) => {
      setErrorMessage(formatSubmissionError(error.message));
    },
  });

  const hasResolvedUser = orgData !== undefined;
  const isAuthenticated = Boolean(orgData?.user);
  const isIndokStudent = orgData?.user?.isIndok ?? false;
  const canCreateNonExternalBooking = isAuthenticated && isIndokStudent;
  const organizations = useMemo(() => orgData?.user?.organizations ?? [], [orgData]);
  const areaConfigurations = useMemo(() => areasData?.janhusAreaConfigurations ?? [], [areasData]);

  const bookingSettings = settingsData?.janhusBookingSettings ?? DEFAULT_SETTINGS;
  const externalBookingsEnabled = bookingSettings.externalBookingsEnabled ?? true;
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

  const isBookingDateDisabled = useCallback(
    (date: dayjs.Dayjs) => {
      if (date.isBefore(dayjs().tz("Europe/Oslo"), "day")) {
        return true;
      }

      return !isDateInActiveSemester(date, bookingSettings as SemesterAvailabilitySettings);
    },
    [bookingSettings]
  );

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

  const contextValue = useMemo(
    () => ({
      activeStep,
      steps: steps.length,
      nextStep: () => setActiveStep((prev) => prev + 1),
      previousStep: () => setActiveStep((prev) => prev - 1),
    }),
    [activeStep]
  );

  const validateBookingStep = useCallback(() => {
    if (!bookingDate || !startsAt || !endsAt) {
      setErrorMessage("Velg område, dato og gyldig tidsrom.");
      return false;
    }

    const startDate = dayjs(startsAt);
    const endDate = dayjs(endsAt);

    if (
      !isDateInActiveSemester(startDate, bookingSettings as SemesterAvailabilitySettings) ||
      !isDateInActiveSemester(endDate, bookingSettings as SemesterAvailabilitySettings)
    ) {
      setErrorMessage("Valgt tidsrom er utenfor aktive bookingsemester.");
      return false;
    }

    if (!dayjs(endsAt).isAfter(dayjs(startsAt))) {
      setErrorMessage("Sluttid må være etter starttid.");
      return false;
    }

    return true;
  }, [bookingDate, bookingSettings, endsAt, startsAt]);

  const validateContactStep = useCallback(() => {
    if (!requesterName || !requesterEmail || !requesterPhone) {
      setErrorMessage("Fyll ut bestillerinformasjon.");
      return false;
    }

    const normalizedRequesterPhone = normalizePhoneNumber(requesterPhone);
    const normalizedResponsiblePhone = normalizePhoneNumber(
      hasDifferentResponsible ? responsiblePhone : requesterPhone
    );

    if (!NORWEGIAN_PHONE_REGEX.test(normalizedRequesterPhone)) {
      setErrorMessage("Telefon bestiller må være et gyldig norsk telefonnummer.");
      return false;
    }

    if (hasDifferentResponsible && (!responsibleName || !responsibleEmail || !responsiblePhone)) {
      setErrorMessage("Fyll ut ansvarliginformasjon når ansvarlig er en annen person.");
      return false;
    }

    if (hasDifferentResponsible && !NORWEGIAN_PHONE_REGEX.test(normalizedResponsiblePhone)) {
      setErrorMessage("Telefon ansvarlig må være et gyldig norsk telefonnummer.");
      return false;
    }

    if (ownerType === "ORGANIZATION" && !organizationId) {
      setErrorMessage("Velg organisasjon for booking på vegne av organisasjon.");
      return false;
    }

    if (!canCreateNonExternalBooking && ownerType !== "EXTERNAL") {
      setErrorMessage("Kun Indøk-studenter kan sende interne eller personlige JanHus-bookinger.");
      return false;
    }

    if (ownerType === "EXTERNAL" && !externalBookingsEnabled) {
      setErrorMessage("Eksterne forespørsler er midlertidig deaktivert.");
      return false;
    }

    return true;
  }, [
    canCreateNonExternalBooking,
    externalBookingsEnabled,
    hasDifferentResponsible,
    organizationId,
    ownerType,
    requesterEmail,
    requesterName,
    requesterPhone,
    responsibleEmail,
    responsibleName,
    responsiblePhone,
  ]);

  const validateContractStep = useCallback(() => {
    if (!acceptedGuidelines) {
      setErrorMessage("Du må bekrefte at du har lest JanHus retningslinjer.");
      return false;
    }

    if (!acceptedContractPlaceholder) {
      setErrorMessage("Du må bekrefte kontraktsgrunnlaget før innsending.");
      return false;
    }

    return true;
  }, [acceptedContractPlaceholder, acceptedGuidelines]);

  const handleSubmit = useCallback(async () => {
    setErrorMessage(undefined);

    if (!validateBookingStep()) {
      return;
    }

    if (!validateContactStep()) {
      return;
    }

    if (!validateContractStep()) {
      return;
    }

    const normalizedRequesterPhone = normalizePhoneNumber(requesterPhone);
    const normalizedResponsiblePhone = normalizePhoneNumber(
      hasDifferentResponsible ? responsiblePhone : requesterPhone
    );

    const resolvedResponsibleName = hasDifferentResponsible ? responsibleName : requesterName;
    const resolvedResponsibleEmail = hasDifferentResponsible ? responsibleEmail : requesterEmail;

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
          responsiblePhone: normalizedResponsiblePhone,
          eventType: ownerType === "EXTERNAL" ? "EXTERNAL" : eventType,
          cleaningRequested,
          comment,
          guestList,
        },
      },
    });
  }, [
    area,
    cleaningRequested,
    comment,
    createBookingRequest,
    endsAt,
    eventType,
    guestList,
    hasDifferentResponsible,
    organizationId,
    ownerType,
    requesterEmail,
    requesterName,
    requesterPhone,
    responsibleEmail,
    responsibleName,
    responsiblePhone,
    startsAt,
    validateBookingStep,
    validateContactStep,
    validateContractStep,
  ]);

  const handleBookingStepNext = useCallback(() => {
    if (!validateBookingStep()) {
      return;
    }

    setErrorMessage(undefined);
    setActiveStep((prev) => prev + 1);
  }, [validateBookingStep]);

  const handleContactStepNext = useCallback(() => {
    if (!validateContactStep()) {
      return;
    }

    setErrorMessage(undefined);
    setActiveStep((prev) => prev + 1);
  }, [validateContactStep]);

  const handleContractStepNext = useCallback(() => {
    if (!validateContractStep()) {
      return;
    }

    setErrorMessage(undefined);
    setActiveStep((prev) => prev + 1);
  }, [validateContractStep]);

  const selectedAreaLabel = AREA_LABELS[area] ?? area;

  const areaOptions = useMemo(
    () =>
      areaConfigurations.length
        ? areaConfigurations.map((configuration) => ({
            value: configuration.area,
            label: AREA_LABELS[configuration.area] ?? configuration.area,
          }))
        : [
            { value: "FIRST_FLOOR", label: AREA_LABELS.FIRST_FLOOR },
            { value: "SECOND_FLOOR", label: AREA_LABELS.SECOND_FLOOR },
            { value: "ENTIRE_HOUSE", label: AREA_LABELS.ENTIRE_HOUSE },
          ],
    [areaConfigurations]
  );

  const eventTypeOptions = useMemo(
    () => Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => ({ value, label })),
    []
  );

  return (
    <>
      <Container>
        <Stack spacing={{ xs: 3, md: 5 }}>
          <Box display={{ xs: "none", md: "block" }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          <StepContext.Provider value={contextValue}>
            <BookingSteps
              bookingDate={bookingDate}
              startsAt={startsAt}
              endsAt={endsAt}
              area={area}
              areaOptions={areaOptions}
              startOptions={startOptions}
              endOptions={endOptions}
              minDurationMinutes={minDurationMinutes}
              slotGranularityMinutes={slotGranularityMinutes}
              openingHour={openingHour}
              closingHour={closingHour}
              selectedDurationMinutes={selectedDurationMinutes}
              ownerType={ownerType}
              organizationId={organizationId}
              organizations={organizations}
              canCreateNonExternalBooking={canCreateNonExternalBooking}
              externalBookingsEnabled={externalBookingsEnabled}
              isAuthenticated={isAuthenticated}
              isIndokStudent={isIndokStudent}
              requesterName={requesterName}
              requesterEmail={requesterEmail}
              requesterPhone={requesterPhone}
              hasDifferentResponsible={hasDifferentResponsible}
              responsibleName={responsibleName}
              responsibleEmail={responsibleEmail}
              responsiblePhone={responsiblePhone}
              eventType={eventType}
              eventTypeOptions={eventTypeOptions}
              comment={comment}
              guestListEntries={guestListEntries}
              cleaningRequested={cleaningRequested}
              acceptedGuidelines={acceptedGuidelines}
              acceptedContractPlaceholder={acceptedContractPlaceholder}
              selectedAreaLabel={selectedAreaLabel}
              loading={loading}
              submittedBookingRequestId={submittedBookingRequestId}
              isBookingDateDisabled={isBookingDateDisabled}
              onAreaChange={setArea}
              onBookingDateChange={setBookingDate}
              onStartsAtChange={setStartsAt}
              onEndsAtChange={setEndsAt}
              onOwnerTypeChange={setOwnerType}
              onOrganizationChange={setOrganizationId}
              onRequesterNameChange={setRequesterName}
              onRequesterEmailChange={setRequesterEmail}
              onRequesterPhoneChange={setRequesterPhone}
              onHasDifferentResponsibleChange={setHasDifferentResponsible}
              onResponsibleNameChange={setResponsibleName}
              onResponsibleEmailChange={setResponsibleEmail}
              onResponsiblePhoneChange={setResponsiblePhone}
              onEventTypeChange={setEventType}
              onCommentChange={setComment}
              onCleaningRequestedChange={setCleaningRequested}
              onAcceptedGuidelinesChange={setAcceptedGuidelines}
              onAcceptedContractPlaceholderChange={setAcceptedContractPlaceholder}
              onOpenGuestListDialog={openGuestListDialog}
              onBookingStepNext={handleBookingStepNext}
              onContactStepNext={handleContactStepNext}
              onContractStepNext={handleContractStepNext}
              onSubmitBooking={handleSubmit}
            />
          </StepContext.Provider>
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

JanHusBookingPage.getLayout = (page) => <Layout simpleHeader>{page}</Layout>;

export default JanHusBookingPage;
