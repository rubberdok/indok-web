import { User } from "./users";

export interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
  location?: string;
  description: string;
  organization: { id: string; name: string; color?: string };
  category?: { id: string; name: string };
  image?: string;
  isAttendable: boolean;
  deadline?: string;
  publisher: User;
  availableSlots?: string;
  shortDescription?: string;
  signupOpenDate?: string;
  usersOnWaitingList?: User[];
  userAttendance?: { isSignedUp: boolean; isOnWaitingList: boolean; hasBoughtTicket: boolean };
  isFull?: boolean;
  price?: string;
  usersAttending?: User[];
  hasExtraInformation?: boolean;
  bindingSignup?: boolean;
  contactEmail?: string;
  allowedGradeYears: number[];
  ticketProductId: string;
}

export interface AttendableEvent extends Event {
  deadline: string;
  availableSlots: string;
  signupOpenDate: string;
  userAttendance: { isSignedUp: boolean; isOnWaitingList: boolean; hasBoughtTicket: boolean };
  usersAttending: User[];
  isFull: boolean;
}

export interface Category {
  id: string;
  name: string;
}
