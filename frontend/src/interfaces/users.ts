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

export interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  allergies: string;
  graduationYear: string;
}

export interface UserInputValidations {
  email: boolean;
  phoneNumber: boolean;
  graduationYear: boolean;
}
