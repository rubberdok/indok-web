import dayjs from "@/lib/date";
import Yup from "@/lib/validation";

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
  const options = ["veggis", "vegetar", "plantebasert", "vegan", "vegansk", "plant based", "vegetarian", "veggie"];
  return options.some((option) => allergies?.toLowerCase().includes(option));
};

/**
 * Rough check before the backend decides: the digits printed on an NTNU card,
 * 10 after "mS" (or "M") on older cards, 15-17 after "UID" on newer cards.
 */
export function isAcceptedCardNumber(value: string): boolean {
  return /^(\d{10}|\d{15,17})$/.test(value.replace(/[\s.-]/g, ""));
}

export type IUserForm = {
  firstName: string;
  lastName: string;
  email: string;
  allergies: string;
  graduationYear: number;
  phoneNumber: string;
  nfcMifareCsn?: string;
  nfcPinCode?: string;
};

export const validationSchema: Yup.ObjectSchema<IUserForm> = Yup.object({
  firstName: Yup.string().required("Fornavn kan ikke være tomt.").min(2, "Kan ikke være kortere enn 2 tegn."),
  lastName: Yup.string().required("Etternavn kan ikke være tomt.").min(2, "Kan ikke være kortere enn to tegn."),
  email: Yup.string().email("Oppgi en gyldig e-postadresse.").ensure(),
  allergies: Yup.string().ensure(),
  graduationYear: Yup.number()
    .required()
    .min(minGraduationYear, `Kan ikke være før ${minGraduationYear}`)
    .max(maxGraduationYear, `Kan ikke være etter ${maxGraduationYear}`),
  phoneNumber: Yup.string()
    .matches(/^(0047|\+47|47)?[49]\d{7}$/, { message: "Må være et gyldig telefonnummer.", excludeEmptyString: true })
    .ensure(),
  nfcMifareCsn: Yup.string()
    .matches(/^[\d\s.-]*$/, {
      message: "Kortnummer kan bare inneholde sifre.",
      excludeEmptyString: true,
    })
    .test("nfc-card-number", "Skriv inn kortnummeret slik det står på NTNU-kortet ditt.", (value) =>
      value ? isAcceptedCardNumber(value) : true
    )
    .optional(),
  nfcPinCode: Yup.string()
    .matches(/^\d{4}$/, { message: "PIN-kode må være nøyaktig 4 sifre.", excludeEmptyString: true })
    .optional(),
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
