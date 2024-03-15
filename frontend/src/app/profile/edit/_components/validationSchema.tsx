import dayjs from "@/lib/date";
import * as Yup from "@/lib/validation";

import { UserFields } from "./UserForm";

const today = dayjs();
const maxGraduationYear = today.month() > 6 ? today.year() + 5 : today.year() + 4;
const minGraduationYear = today.month() > 6 ? today.year() + 1 : today.year();

const userValidationSchema: Yup.ObjectSchema<UserFields> = Yup.object({
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

export { userValidationSchema, maxGraduationYear, minGraduationYear };
