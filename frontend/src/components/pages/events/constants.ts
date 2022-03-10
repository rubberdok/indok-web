export const DEFAULT_INPUT: EventDataType = {
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  location: "",
  organizationId: "",
  categoryId: "",
  image: "",
  deadline: "",
  signupOpenDate: "",
  availableSlots: "",
  // price: undefined,
  shortDescription: "",
  hasExtraInformation: false,
  contactEmail: "",
  bindingSignup: false,
  allowedGradeYears: [1, 2, 3, 4, 5],
};

export type EventDataType = {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  organizationId: string;
  categoryId: string;
  image: string;
  deadline: string;
  signupOpenDate: string;
  availableSlots: string;
  // price: undefined,
  shortDescription: string;
  hasExtraInformation: boolean;
  contactEmail: string;
  bindingSignup: boolean;
  allowedGradeYears: number[];
};
