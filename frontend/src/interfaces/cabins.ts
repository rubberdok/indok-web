import { ChangeEvent } from "react";

export interface Booking {
  id: string;
  firstname: string;
  surname: string;
  phone: number;
  receiverEmail: string;
  bookFrom: string;
  bookTo: string;
  price: number;
  cabins: Cabin[];
}

export interface Cabin {
  id: string;
  name: string;
}

export interface BookingFromTo {
  from: Date;
  to: Date;
}

export interface QueryVariables {
  year: string;
  month: string;
  start?: string;
  end?: string;
}

export interface ContractProps {
  contractData: {
    firstname: string | null;
    surname: string | null;
    cabins: string[];
    fromDate: string;
    toDate: string;
    price: number;
  };
}

export interface SummaryProps {
  from: string;
  to: string;
  cabins: string[];
  price: number;
  nights: number;
}

export interface ImageSliderProps {
  cabins: string[];
}

export type InputFieldsEvent =
  | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | React.ChangeEvent<{ name?: string | undefined; value: unknown }>;

export interface InputValueTypes {
  firstname: string;
  surname: string;
  receiverEmail: string;
  phone: string;
  numberIndok: number;
  numberExternal: number;
}

export interface BookingData extends InputValueTypes {
  bookFrom: string;
  bookTo: string;
  cabins: string[];
  price: number;
}

export interface ContactInfoValidations {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  phone: boolean;
  numberIndok: boolean;
  numberExternal: boolean;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  numberIndok: number;
  numberExternal: number;
}
