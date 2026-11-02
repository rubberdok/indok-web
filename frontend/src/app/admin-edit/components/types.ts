import type { Dispatch, SetStateAction } from "react";

export type AdminEditableUser = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phoneNumber?: string | null;
  allergies?: string | null;
  graduationYear?: number | null;
  gradeYear?: number | null;
  dateJoined?: string | null;
  lastLogin?: string | null;
  feideUserid?: string | null;
  feideEmail?: string | null;
  nfcMifareCsn?: string | null;
  nfcCardNumber?: string | null;
  nfcHasPin?: boolean | null;
  nfcPermanentAccess?: boolean | null;
  nfcPermanentAccessStatus?: string | null;
  nfcPermanentAccessEnds?: string | null;
  nfcPermanentAccessHistory?:
    | readonly { given: boolean; changedAt: string; changedBy?: string | null; reason: string }[]
    | null;
  nfcNote?: string | null;
  nfcNoteUpdatedAt?: string | null;
  nfcNoteUpdatedBy?: string | null;
  organizations?: readonly { id: string; name: string }[] | null;
};

export type AdminEditForm = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  allergies: string;
  graduationYear: string;
  nfcMifareCsn: string;
  nfcPinCode: string;
  nfcPermanentAccess: boolean;
  nfcNote: string;
};

export type SetAdminEditForm = Dispatch<SetStateAction<AdminEditForm>>;

export const EMPTY_ADMIN_EDIT_FORM: AdminEditForm = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  allergies: "",
  graduationYear: "",
  nfcMifareCsn: "",
  nfcPinCode: "",
  nfcPermanentAccess: false,
  nfcNote: "",
};

export const MIFARE_CSN_RULE_TEXT =
  "Sifrene etter «UID» på kortet, eller de 10 sifrene etter «mS» eller «M» på eldre kort.";
