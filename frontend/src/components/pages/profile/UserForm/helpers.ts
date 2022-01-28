import dayjs from "dayjs";
import * as Yup from "yup";

const today = dayjs();
export const maxGraduationYear = today.month() > 7 ? today.year() + 5 : today.year() + 4;
const minGraduationYear = today.month() > 7 ? today.year() + 1 : today.year();

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

export const isVegetarian = (allergies: string): boolean => {
  const options = ["veggis", "vegetar", "plantebasert", "vegan"];
  return options.some((option) => allergies.toLowerCase().includes(option));
};

export const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("Fornavn kan ikke være tomt.").min(2, "Kan ikke være kortere enn 2 tegn."),
  lastName: Yup.string().required("Etternavn kan ikke være tomt.").min(2, "Kan ikke være kortere enn to tegn."),
  email: Yup.string().email("Oppgi en gyldig e-postadresse.").notRequired(),
  allergies: Yup.string().notRequired(),
  graduationYear: Yup.number()
    .required()
    .min(minGraduationYear, `Kan ikke være før ${minGraduationYear}`)
    .max(maxGraduationYear, `Kan ikke være etter ${maxGraduationYear}`),
  phoneNumber: Yup.string()
    .min(8, "Telefonnummeret må være 8 tegn eller lenger.")
    .max(12, "Telefonnummeret kan ikke være mer enn 12 tegn.")
    .matches(/(0047|\+47|47)?[49]\d{7}/, "Må være et gyldig telefonnummer."),
});

export const suggestGraduationYear = () => {
  const currentMonth = dayjs().month();
  if (currentMonth > 8) {
    return dayjs().year() + 5;
  }
  return dayjs().year() + 4;
};
