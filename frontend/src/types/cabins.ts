import { SelectChangeEvent } from "@mui/material";
import { ChangeEvent } from "react";

export type BasicBooking = {
  firstName: string;
  lastName: string;
  phone: string;
  receiverEmail: string;
};

export type Participants = {
  internalParticipants: number;
  externalParticipants: number;
};

export type ContactInfo = BasicBooking & Participants;

export type ContactInfoValidations = Record<keyof ContactInfo, boolean>;

export type DatePick = {
  checkInDate?: string;
  checkOutDate?: string;
  isValid?: boolean;
};

export type ModalData = {
  contractViewed: boolean;
  displayPopUp: boolean;
};

export type InputFieldsEvent =
  | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | React.ChangeEvent<{ name?: string; value: unknown }>
  | SelectChangeEvent<number>
  | SelectChangeEvent<string>;
