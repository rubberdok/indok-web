export interface User {
  id: string;
  feideEmail: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  dateJoined: string;
  graduationYear: number;
  gradeYear: number;
  allergies: string;
  phoneNumber: string;
  firstLogin: boolean;
  events: Partial<Event>[];
}
