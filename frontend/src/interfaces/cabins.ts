import { ChangeEvent } from "react";

export interface BasicBooking {
  firstname: string;
  lastname: string;
  phone: string;
  receiverEmail: string;
}

export interface Booking extends BasicBooking {
  id: string;
  checkIn: string;
  checkOut: string;
  price: number;
  isTentative: boolean;
  cabins: Cabin[];
}

export interface Cabin {
  id: string;
  name: string;
  maxGuests: number;
  internalPrice: number;
  externalPrice: number;
}

export interface ContractProps {
  contractData: {
    firstname: string | null;
    lastname: string | null;
    cabins: string[];
    fromDate: string;
    toDate: string;
    price: number;
  };
}

export type InputFieldsEvent =
  | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | React.ChangeEvent<{ name?: string | undefined; value: unknown }>;

export interface ContactInfoValidations {
  firstname: boolean;
  lastname: boolean;
  receiverEmail: boolean;
  phone: boolean;
  internalParticipants: boolean;
  externalParticipants: boolean;
}

export interface ContactInfo extends BasicBooking {
  internalParticipants: number;
  externalParticipants: number;
}
