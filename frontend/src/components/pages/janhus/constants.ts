export const JANHUS_EVENT_TYPE_LABELS: Record<string, string> = {
  INTERNAL: "Intern",
  OPEN_FOR_INDOK: "Åpent for Indøk-studenter",
  PRIVATE: "Privat",
  EXTERNAL: "Eksternt",
};

export type OwnerType = "PERSONAL" | "ORGANIZATION" | "EXTERNAL";
export type SortDirection = "asc" | "desc";
export type SortBy = "startsAt" | "area" | "eventType" | "status" | "ownerType";

export const REQUEST_STATUS_LABELS: Record<string, string> = {
  PENDING: "Venter",
  APPROVED: "Godkjent",
  REJECTED: "Avslått",
};

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PROVISIONAL: "Foreløpig",
  PENDING_ADMIN_REVIEW: "Venter behandling",
  CONFIRMED: "Godkjent",
  DECLINED: "Avslått",
  CANCELLED: "Kansellert",
  BLOCKED: "Blokkert",
};

export const DEPOSIT_STATUS_LABELS: Record<string, string> = {
  NOT_REQUIRED: "Ikke nødvendig",
  REQUIRED: "Påkrevd",
  REQUESTED: "Etterspurt",
  PAID: "Betalt",
  REFUNDED: "Refundert",
  WITHHELD: "Holdt tilbake",
};

export const DOOR_ACCESS_POLICY_LABELS: Record<string, string> = {
  BOOKER_ONLY: "Kun bestiller",
  BOOKER_AND_RESPONSIBLE: "Bestiller og ansvarlig",
  ALL_PARTICIPANTS: "Bestiller, ansvarlig og gjesteliste",
};

export const OWNER_TYPE_LABELS: Record<OwnerType, string> = {
  PERSONAL: "Personlig",
  ORGANIZATION: "Forening",
  EXTERNAL: "Ekstern",
};

export const MANUAL_ENTRY_PREFIX = "manual:";

export type SettingsForm = {
  minDurationMinutes: number;
  slotGranularityMinutes: number;
  openingHour: number;
  closingHour: number;
  bufferMinutes: number;
  organizationBookingOpensWeeksBefore: number;
  generalBookingOpensWeeksBefore: number;
  fallStartDate: string;
  fallEndDate: string;
  springStartDate: string;
  springEndDate: string;
  fallSemesterActive: boolean;
  springSemesterActive: boolean;
  externalBookingsEnabled: boolean;
  privateBookingsEnabled: boolean;
  cleaningOptionEnabled: boolean;
};

export type AreaForm = {
  internalPricePerHour: string;
  externalPricePerHour: string;
  cleaningFee: string;
  defaultDepositAmount: string;
};
