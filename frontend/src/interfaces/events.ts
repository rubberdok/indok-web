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
  publisher: User;
  availableSlots?: GradeDistribution[];
  shortDescription: string;
  usersOnWaitingList?: SignUp[];
  userAttendance?: { isSignedUp: boolean; isOnWaitingList: boolean };
  usersAttending?: SignUp[];
  hasExtraInformation?: boolean;
  contactEmail?: string;
  allowedGradeYears: number[];
  attendable?: Attendable;
  isFull: boolean;
}

interface GradeDistribution {
  category: string;
  availableSlots: number;
}

export interface Attendable {
  id: string;
  deadline: string;
  bindingSignup: boolean;
  price: string;
  signupOpenDate: string;
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
}
