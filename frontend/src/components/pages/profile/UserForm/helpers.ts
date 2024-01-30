import dayjs from "@/lib/date";
import * as Yup from "@/lib/validation";

const today = dayjs();
export const maxGraduationYear = today.month() > 6 ? today.year() + 5 : today.year() + 4;
const minGraduationYear = today.month() > 6 ? today.year() + 1 : today.year();

export const suggestNames = (name: string | undefined): { firstName: string; lastName: string } => {
  if (!name) {
    return { firstName: "", lastName: "" };
  }
  const names = name.split(" ");
  if (names.length === 1) return { firstName: name, lastName: "" };
  return {
    firstName: names.slice(0, Math.floor(names.length / 2)).join(" "),
    lastName: names.slice(Math.floor(names.length / 2)).join(" "),
  };
};

export const isVegetarian = (allergies: string | null): boolean => {
  const options = ["veggis", "vegetar", "plantebasert", "vegan"];
  return options.some((option) => allergies?.toLowerCase().includes(option));
};

export type IUserForm = {
  firstName: string;
  lastName: string;
  allergies: string;
  graduationYear: number;
  phoneNumber: string;
};

export const validationSchema: Yup.ObjectSchema<IUserForm> = Yup.object({
  firstName: Yup.string().required("Fornavn kan ikke være tomt.").min(2, "Kan ikke være kortere enn 2 tegn."),
  lastName: Yup.string().required("Etternavn kan ikke være tomt.").min(2, "Kan ikke være kortere enn to tegn."),
  allergies: Yup.string().ensure(),
  graduationYear: Yup.number()
    .required()
    .min(minGraduationYear, `Kan ikke være før ${minGraduationYear}`)
    .max(maxGraduationYear, `Kan ikke være etter ${maxGraduationYear}`),
  phoneNumber: Yup.string()
    .matches(/^(0047|\+47|47)?[49]\d{7}$/, { message: "Må være et gyldig telefonnummer.", excludeEmptyString: true })
    .ensure(),
});

export const suggestGraduationYear = () => {
  const currentMonth = today.month();
  if (currentMonth > 7) {
    return today.year() + 5;
  }
  return today.year() + 4;
};

export const currentGradeYear = (graduationYear: number) => {
  const currentMonth = today.month();
  if (currentMonth < 7) {
    return 5 - (graduationYear - today.year());
  }
  return 6 - (graduationYear - today.year());
};
