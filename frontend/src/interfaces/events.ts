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
  availableSlots?: GradeDistribution[];
  shortDescription: string;
  usersOnWaitingList?: User[];
  userAttendance?: { isSignedUp: boolean; isOnWaitingList: boolean; hasBoughtTicket: boolean };
  usersAttending?: User[];
  hasExtraInformation?: boolean;
  contactEmail?: string;
  allowedGradeYears: number[];
  attendable?: Attendable;
  isFull: boolean;
  product: Product;
};

export type GradeDistribution = {
  category: string;
  availableSlots: number;
};

export type Attendable = {
  id: string;
  deadline: string;
  bindingSignup: boolean;
  price: string;
  signupOpenDate: string;
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
