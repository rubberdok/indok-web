export type User = {
  firstName: string;
  lastName: string;
  email: string;
  gradeYear: string;
  allergies: string;
  phoneNumber: string;
};

export type EditUser = {
  id: string;
  graduationYear: number;
} & Pick<User, "firstName" | "lastName" | "email" | "allergies" | "phoneNumber">;
