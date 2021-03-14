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
  availableSlots?: number;
  shortDescription?: string;
  signupOpenDate?: string;
  userAttendance?: { isSignedUp: boolean; isOnWaitingList: boolean };
  isFull?: boolean;
  price?: number;
  hasExtraInformation?: boolean;
  bindingSignup?: boolean;
  contactEmail?: string;
  allowedGradeYearsList: number[];
}

export interface AttendableEvent extends Event {
  deadline: string;
  availableSlots: number;
  signupOpenDate: string;
  userAttendance: { isSignedUp: boolean; isOnWaitingList: boolean };
  usersAttending: User[];
  isFull: boolean;
}

export interface Category {
  id: string;
  name: string;
}
