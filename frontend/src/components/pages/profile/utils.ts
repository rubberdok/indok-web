import { UserInput, UserInputValidations } from "@interfaces/users";
import validator from "validator";

export const validateInput = (input: Partial<UserInput>): UserInputValidations => {
  const { email, phoneNumber, graduationYear } = input;
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const validationResult: UserInputValidations = {
    email: email ? validator.isEmail(email) : true,
    phoneNumber: phoneNumber ? validator.isMobilePhone(phoneNumber, "nn-NO") : true,
    graduationYear: false, // required field
  };

  if (graduationYear) {
    const graduationYearNumber = parseInt(graduationYear);
    validationResult.graduationYear = graduationYear
      ? Number.isInteger(graduationYear) && currentMonth < 8
        ? graduationYearNumber >= currentYear && graduationYearNumber <= currentYear + 4
        : graduationYearNumber >= currentYear + 1 && graduationYearNumber <= currentYear + 5
      : false;
  }
  return validationResult;
};

export const suggestNames = (name: string): { suggestedFirstName: string; suggestedLastName: string } => {
  const names = name.split(" ");
  if (names.length === 1) return { suggestedFirstName: name, suggestedLastName: "" };
  if (names.length % 2 == 0)
    return {
      suggestedFirstName: names.slice(0, names.length / 2).join(" "),
      suggestedLastName: names.slice(names.length / 2).join(" "),
    };
  return {
    suggestedFirstName: names.slice(0, Math.floor(names.length / 2)).join(" "),
    suggestedLastName: names.slice(Math.floor(names.length / 2)).join(" "),
  };
};
