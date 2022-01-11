import { Product } from "./ecommerce";
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
  usersOnWaitingList?: SignUp[];
  userAttendance?: { isSignedUp: boolean; isOnWaitingList: boolean; hasBoughtTicket: boolean };
  isFull?: boolean;
  price?: string;
  usersAttending?: SignUp[];
  hasExtraInformation?: boolean;
  bindingSignup?: boolean;
  contactEmail?: string;
  allowedGradeYears: number[];
  products: Product[];
}

export interface AttendableEvent extends Event {
  deadline: string;
  availableSlots: string;
  signupOpenDate: string;
  userAttendance: { isSignedUp: boolean; isOnWaitingList: boolean };
  usersAttending: SignUp[];
  isFull: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface SignUp {
  id: string;
  user: User;
  userEmail: string;
  userGradeYear: number;
  userAllergies: string;
  userPhoneNumber: string;
  hasBoughtTicket: boolean;
}
