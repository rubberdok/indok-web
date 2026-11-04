import { CombinedGraphQLErrors } from "@apollo/client/errors";

import { isAcceptedCardNumber } from "@/components/pages/profile/UserForm/helpers";
import dayjs from "@/lib/date";

import { MIFARE_CSN_RULE_TEXT, type AdminEditableUser, type AdminEditForm } from "./types";

export function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof CombinedGraphQLErrors) {
    if (error.errors.length > 0) {
      return error.errors.map((e) => e.message).join(" · ");
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

const OSLO = "Europe/Oslo";

export function toOsloInput(value?: string | null): string {
  return value ? dayjs(value).tz(OSLO).format("YYYY-MM-DDTHH:mm") : "";
}

export function fromOsloInput(value: string): string {
  return dayjs.tz(value, OSLO).toISOString();
}

export function adminEditFormFor(user: AdminEditableUser): AdminEditForm {
  return {
    username: user.username ?? "",
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? "",
    phoneNumber: user.phoneNumber ?? "",
    allergies: user.allergies ?? "",
    graduationYear: user.graduationYear?.toString() ?? "",
    nfcMifareCsn: user.nfcCardNumber ?? user.nfcMifareCsn ?? "",
    nfcPinCode: "",
    nfcPermanentAccess: Boolean(user.nfcPermanentAccess),
    nfcPermanentAccessUntil: toOsloInput(user.nfcPermanentAccessUntil),
    nfcNote: user.nfcNote ?? "",
  };
}

function hasCard(user: AdminEditableUser, form: AdminEditForm): boolean {
  return form.nfcMifareCsn.trim().length > 0 || Boolean(user.nfcMifareCsn);
}

export function validateNfcInput(user: AdminEditableUser, form: AdminEditForm): string | null {
  const hasNewMifareCsn = form.nfcMifareCsn.trim().length > 0;
  const pin = form.nfcPinCode.trim();

  if (hasNewMifareCsn && !isAcceptedCardNumber(form.nfcMifareCsn)) {
    return MIFARE_CSN_RULE_TEXT;
  }

  if (pin.length > 0 && !/^\d{4}$/.test(pin)) {
    return "PIN-kode må være nøyaktig 4 sifre.";
  }

  if (pin.length > 0 && !hasCard(user, form)) {
    return "Du må sette et kortnummer før PIN-kode kan lagres.";
  }

  if (form.nfcPermanentAccess && !hasCard(user, form)) {
    return "Du må sette et kortnummer før permanent tilgang kan gis.";
  }

  return null;
}

export function nfcInputFor(user: AdminEditableUser, form: AdminEditForm, { withNote }: { withNote: boolean }) {
  const removingAccess = Boolean(user.nfcPermanentAccess) && !form.nfcPermanentAccess;
  const untilChanged = form.nfcPermanentAccessUntil !== toOsloInput(user.nfcPermanentAccessUntil);
  const changedUntil = form.nfcPermanentAccess && untilChanged;
  return {
    mifareCsn: form.nfcMifareCsn.trim() || null,
    pinCode: form.nfcPinCode.trim() || null, // empty = keep the current PIN
    permanentAccess: hasCard(user, form) ? form.nfcPermanentAccess : null,
    ...(changedUntil && {
      permanentAccessUntil: form.nfcPermanentAccessUntil ? fromOsloInput(form.nfcPermanentAccessUntil) : null,
    }),
    note: withNote && !removingAccess ? form.nfcNote : null,
  };
}
