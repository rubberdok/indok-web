import { Organization } from "./organizations";

export type User = {
  __typename: string;
  id: string;
  feideEmail: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  dateJoined: string;
  organizations: Organization[];
  graduationYear: number;
  gradeYear: number;
  allergies: string;
  phoneNumber: string;
  firstLogin: boolean;
  events: Partial<Event>[];
}
