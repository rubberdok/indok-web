export type User = {
  firstName: string;
  lastName: string;
  email: string;
  gradeYear: string;
  allergies: string;
};

export type EditUser = {
  id: string;
  graduationYear: string;
} & Pick<User, "firstName" | "lastName" | "email" | "allergies">;
