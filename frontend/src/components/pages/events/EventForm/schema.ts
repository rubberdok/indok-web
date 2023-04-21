import * as yup from "yup";

const yupTypes: Record<
  string,
  {
    article: "en" | "et";
    type: string;
  }
> = {
  string: {
    article: "en",
    type: "streng",
  },
  date: {
    article: "en",
    type: "dato",
  },
  number: {
    article: "et",
    type: "tall",
  },
};

yup.setLocale({
  mixed: {
    required: ({ label, path }) => `${label ?? path} er påkrevd`,
    notType: ({ label, path, type }) => {
      const { article, type: typeName } = yupTypes[type];
      return `${label ?? path} er må være ${article} gyldig ${typeName}`;
    },
  },
  string: {
    min: ({ min, label, path }) => `${label ?? path} kan ikke være kortere enn ${min} tegn`,
    max: ({ max, label, path }) => `${label ?? path} kan ikke være lengre enn ${max} tegn`,
    email: ({ label, path }) => `${label ?? path} må være en gyldig e-postadresse`,
  },
  number: {
    min: ({ min, label, path }) => `${label ?? path} kan ikke være mindre enn ${min}`,
    max: ({ max, label, path }) => `${label ?? path} kan ikke være større enn ${max}`,
  },
  date: {
    min: ({ label, path }) => `${label ?? path} må være etter nåværende tid`,
    max: ({ max, label, path }) => `${label ?? path} må være før ${max}`,
  },
});

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
  isAttendable: boolean;
  details: {
    binding: boolean;
    signUpOpen: Date;
    deadline: Date;
    availableSeats: number | null;
  };
};

/**
 * Schema for validation everything related to sign ups and registrations. If `isAttendable` is set, then the contents
 * of `details` will be validated. Otherwise, they're simply ignored.
 */
const registrationSchema: yup.ObjectSchema<RegistrationSchema> = yup.object({
  isAttendable: yup.boolean().required().default(false),
  details: yup
    .object({
      binding: yup.boolean().required().default(false).label("Bindende påmelding"),
      signUpOpen: yup.date().min(new Date()).required().label("Starttid"),
      deadline: yup.date().min(new Date()).required().label("Sluttid"),
      availableSeats: yup.number().min(0).default(null).nullable().label("Antall plasser"),
    })
    .when("isAttendable", {
      is: false,
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
