import { ContactFieldErrors } from "@/components/pages/janhus/validation";
import type dayjs from "@/lib/date";

export type JanHusOwnerType = "PERSONAL" | "ORGANIZATION" | "EXTERNAL";

export const JANHUS_OWNER_TYPE_LABELS: Record<JanHusOwnerType, string> = {
  PERSONAL: "Personlig booking",
  ORGANIZATION: "Booking på vegne av forening",
  EXTERNAL: "Ekstern forespørsel",
};

type SelectOption = {
  value: string;
  label: string;
};

type OrganizationOption = {
  id: string;
  name: string;
};

export type BookingStepsProps = {
  bookingDate: dayjs.Dayjs | undefined;
  startsAt: string;
  endsAt: string;
  area: string;
  areaOptions: SelectOption[];
  startOptions: SelectOption[];
  endOptions: SelectOption[];
  minDurationMinutes: number;
  openingHour: number;
  closingHour: number;
  selectedDurationMinutes: number | undefined;

  ownerType: JanHusOwnerType;
  organizationId: string;
  organizations: OrganizationOption[];
  canCreateNonExternalBooking: boolean;
  externalBookingsEnabled: boolean;
  cleaningOptionEnabled: boolean;

  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  hasDifferentResponsible: boolean;
  responsibleName: string;
  responsibleEmail: string;
  responsiblePhone: string;

  eventType: string;
  eventTypeOptions: SelectOption[];
  canBookPersonally: boolean;

  comment: string;
  guestListEntries: string[];
  cleaningRequested: boolean;
  acceptedGuidelines: boolean;
  acceptedContractPlaceholder: boolean;

  selectedAreaLabel: string;
  loading: boolean;
  submittedBookingReference: string | undefined;
  contactFieldErrors: ContactFieldErrors;
  showAllContactErrors: boolean;
  isBookingDateDisabled: (date: dayjs.Dayjs) => boolean;
  lastBookableDate?: dayjs.Dayjs;

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
