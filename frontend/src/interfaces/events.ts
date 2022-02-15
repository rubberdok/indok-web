import { Product } from "./ecommerce";
import { User } from "./users";

export type Event = {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
  location?: string;
  description: string;
  organization: { id: string; name: string; color?: string };
  category?: { id: string; name: string };
  image?: string;
  publisher: User;
  shortDescription: string;
  contactEmail?: string;
  allowedGradeYears: number[];
  attendable?: Attendable;
  product: Product;
};

export type SlotDistribution = {
  gradeGroup: string;
  availableSlots: number;
};

export type Attendable = {
  id: string;
  deadline?: string;
  bindingSignup: boolean;
  price?: string;
  signupOpenDate: string;
  slotDistribution: SlotDistribution[];
  hasExtraInformation: boolean;
  totalAvailableSlots: number;
  isFull: boolean;
  usersOnWaitingList?: User[];
  usersAttending?: User[];
  userAttendance?: { isAttending: boolean; isOnWaitingList: boolean; hasBoughtTicket: boolean };
};

export type Category = {
  id: string;
  name: string;
};

export type SignUp = {
  id: string;
  user: User;
  userEmail: string;
  userGradeYear: number;
  userAllergies: string;
  userPhoneNumber: string;
  hasBoughtTicket: boolean;
};
