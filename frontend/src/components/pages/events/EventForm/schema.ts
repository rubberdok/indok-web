import * as yup from "@/lib/validation";

type InfoSchema = {
  title: string;
  shortDescription: string | null;
  description: string;
  category: string | null;
  contactEmail: string | null;
  organizer: string;
  gradeYears: number[];
};
/**
 * Schema for basic information about the event, responsible for validating things like
 * title, description, grade years etc.
 */
const infoSchema: yup.ObjectSchema<InfoSchema> = yup.object({
  title: yup.string().max(100).label("Tittel").required(),
  shortDescription: yup.string().max(50).label("Kort beskrivelse").nullable().defined(),
  description: yup.string().max(10000).label("Beskrivelse").required(),
  category: yup.string().label("Kategori").nullable().defined(),
  contactEmail: yup.string().email().label("Kontakt (e-post)").nullable().defined(),
  organizer: yup.string().label("Arrangør").required(),
  gradeYears: yup
    .array()
    .of(yup.number().defined().required().min(1).max(6))
    .defined()
    .label("Klassetrinn")
    .default([]),
});

type TimeAndPlaceSchema = {
  location: string;
  start: Date;
  end: Date;
};

/**
 * Schema for the event's time and location
 *
 */
const timeAndPlaceSchema: yup.ObjectSchema<TimeAndPlaceSchema> = yup
  .object({
    location: yup.string().max(100, "Maks 100 tegn").label("Sted").defined(),
    start: yup.date().min(new Date()).required().label("Starttid").nonNullable(),
    end: yup
      .date()
      .required()
      .nonNullable()
      .min(new Date())
      .min(yup.ref("start"), ({ label }) => `${label} må være etter starttiden`)
      .label("Sluttid"),
  })
  .required();

type RegistrationSchema = {
  variant: "open" | "closed" | "binding";
  details: {
    requiresExtraInformation: boolean;
    signUpOpen: Date;
    deadline: Date;
    availableSeats: number | null;
    slotsPerYear: number[] | null;
    isYearDivided: boolean;
  };
};

/**
 * Schema for validation everything related to sign ups and registrations. If `isAttendable` is set, then the contents
 * of `details` will be validated. Otherwise, they're simply ignored.
 */
const registrationSchema: yup.ObjectSchema<RegistrationSchema> = yup.object({
  variant: yup.string().required().oneOf(["open", "closed", "binding"]).label("Påmelding"),
  details: yup
    .object({
      requiresExtraInformation: yup.boolean().default(false).label("Ekstra informasjon").required(),
      signUpOpen: yup.date().required().label("Starttid"),
      deadline: yup
        .date()
        .min(yup.ref("signUpOpen"), "Må være etter påmeldingen har åpnet.")
        .required()
        .label("Sluttid"),
      availableSeats: yup.number().min(0).default(null).nullable().label("Antall plasser"),
      slotsPerYear: yup
        .array()
        .of(yup.number().defined().required().min(0).default(0))
        .defined()
        .label("Plasser per klasse")
        .default([0, 0, 0, 0, 0]),
      isYearDivided: yup.boolean().default(false).label("Klassefordelte plasser").required(),
    })
    .when("variant", {
      is: "closed",
      then: () => yup.object(),
    }),
});

export type IEventForm = {
  info: InfoSchema;
  timeAndPlace: TimeAndPlaceSchema;
  registration: RegistrationSchema;
  review: Record<string, never> | undefined;
};
/**
 * Combined validation schema of the above schemas
 */
export const schema: yup.ObjectSchema<IEventForm> = yup
  .object({
    info: infoSchema,
    timeAndPlace: timeAndPlaceSchema,
    registration: registrationSchema,
    review: yup.object(),
  })
  .required();
