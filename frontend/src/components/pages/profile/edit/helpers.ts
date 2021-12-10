import dayjs from "dayjs";
import * as Yup from "yup";

const currentYear = dayjs().year();

export const isVegetarian = (allergies: string): boolean => {
  const options = ["vegetarianer", "veggis", "vegetar", "plantebasert", "vegan", "vegansk"];
  return options.some((option) => allergies.toLowerCase().includes(option));
};

export const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("Fornavn kan ikke være tomt.").min(2, "Kan ikke være kortere enn 2 tegn."),
  lastName: Yup.string().required("Etternavn kan ikke være tomt.").min(2, "Kan ikke være kortere enn to tegn."),
  email: Yup.string().email("Oppgi en gyldig e-postadresse.").notRequired(),
  allergies: Yup.string().notRequired(),
  graduationYear: Yup.number().required().min(currentYear),
  phoneNumber: Yup.string()
    .length(8, "Telefonnummeret må være 8 tegn.")
    .matches(/(4|9)\d{7}/, "Ikke inkluder landskode, må starte på 4 eller 9."),
});
