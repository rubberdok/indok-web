import { Organization } from "@interfaces/organizations";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  gradeYear: string;
  allergies: string;
  phoneNumber: string;
  firstLogin: boolean;
  feideEmail: string;
  organizations: Pick<Organization, "id" | "name">[];
};

export type EditUser = {
  id: string;
  graduationYear: number;
} & Pick<User, "firstName" | "lastName" | "email" | "allergies" | "phoneNumber" | "firstLogin" | "feideEmail">;
