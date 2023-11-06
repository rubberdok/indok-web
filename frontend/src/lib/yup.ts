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

export function initializeYup() {
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
}
