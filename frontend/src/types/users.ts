export type User = {
  firstName: string;
  lastName: string;
  email: string;
  gradeYear: string;
  allergies: string;
  phoneNumber: string;
  firstLogin: boolean;
  feideEmail: string;
};

export type EditUser = {
  id: string;
  graduationYear: number;
  canUpdateYear: boolean;
} & Pick<User, "firstName" | "lastName" | "email" | "allergies" | "phoneNumber" | "firstLogin" | "feideEmail">;
