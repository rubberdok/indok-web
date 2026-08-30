/**
 * Field-level validation for the JanHus booking form.
 *
 * Returns a message per field so each input can highlight itself the way the
 * event form does, instead of pushing one combined error to the top of the page.
 */

export const NORWEGIAN_PHONE_REGEX = /^(0047|\+47|47)?[49]\d{7}$/;

export const normalizePhoneNumber = (value: string) => value.replace(/\s/g, "");

export const EMAIL_REGEX =
  /^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|[a-z0-9][a-z0-9-]{0,61}[a-z0-9])$/i;

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value.trim());

export type ContactFieldErrors = Partial<
  Record<
    | "requesterName"
    | "requesterEmail"
    | "requesterPhone"
    | "responsibleName"
    | "responsibleEmail"
    | "responsiblePhone"
    | "organizationId",
    string
  >
>;

type ContactValues = {
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  hasDifferentResponsible: boolean;
  responsibleName: string;
  responsibleEmail: string;
  responsiblePhone: string;
  ownerType: string;
  organizationId: string;
};

const requiredText = (value: string, message: string) => (value.trim() ? undefined : message);

const emailText = (value: string) => {
  if (!value.trim()) return "Fyll ut e-postadresse.";
  return isValidEmail(value) ? undefined : "Ugyldig e-postadresse.";
};

const phoneText = (value: string) => {
  if (!value.trim()) return "Fyll ut telefonnummer.";
  return NORWEGIAN_PHONE_REGEX.test(normalizePhoneNumber(value)) ? undefined : "Må være et gyldig norsk telefonnummer.";
};

export const validateContactFields = (values: ContactValues): ContactFieldErrors => {
  const errors: ContactFieldErrors = {
    requesterName: requiredText(values.requesterName, "Fyll ut navn."),
    requesterEmail: emailText(values.requesterEmail),
    requesterPhone: phoneText(values.requesterPhone),
  };

  if (values.hasDifferentResponsible) {
    errors.responsibleName = requiredText(values.responsibleName, "Fyll ut navn.");
    errors.responsibleEmail = emailText(values.responsibleEmail);
    errors.responsiblePhone = phoneText(values.responsiblePhone);
  }

  if (values.ownerType === "ORGANIZATION" && !values.organizationId) {
    errors.organizationId = "Velg forening.";
  }

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => Boolean(message))) as ContactFieldErrors;
};
