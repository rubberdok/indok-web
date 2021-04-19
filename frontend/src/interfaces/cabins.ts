export interface BasicBooking {
  firstname: string;
  lastname: string;
  phone: string;
  receiverEmail: string;
}

export interface PublicBooking {
  id: string;
  checkIn: string;
  checkOut: string;
  cabins: Cabin[];
}

interface Participants {
  internalParticipants: number;
  externalParticipants: number;
}

export interface Booking extends BasicBooking, PublicBooking, Participants {
  price: number;
  isTentative: boolean;
}

export interface Cabin {
  id: string;
  name: string;
  maxGuests: number;
  internalPrice: number;
  externalPrice: number;
}

export type ContactInfo = BasicBooking & Participants;
export type ContactInfoValidations = {
  [key in keyof ContactInfo]: boolean;
};
