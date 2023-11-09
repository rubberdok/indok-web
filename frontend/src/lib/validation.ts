/* eslint-disable no-restricted-imports */
/**
 * This file configures our yup instance and re-exports yup so that
 * we can share a configured yup instance across our application without
 * worrying about configuring yup in every file that uses it, or
 * running the configuration code on initial page load.
 */
import { setLocale } from "yup";

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

setLocale({
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

export * from "yup";
