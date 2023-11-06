import dayjs from "dayjs";
import validator from "validator";
import * as Yup from "yup";

import {
  AdminBookingFragment,
  BookingInput,
  BookingSemesterFragment,
  CabinFragment,
  EmailInput,
  SendEmailMutationVariables,
} from "@/generated/graphql";

import { BasicBooking, ContactInfo, ContactInfoValidations, DatePick } from "@/types/cabins";

/* File containing helper functions for cabins. */

export const validateName = (name: string): boolean => name?.length > 0;

export const validateEmail = (email: string): boolean => (email ? validator.isEmail(email) : false);

export const validateSelect = (internalParticipants: number, externalParticipants: number): boolean =>
  internalParticipants > 0 || externalParticipants > 0;

export const validatePhone: (phone: string) => boolean = (phone) =>
  phone ? validator.isMobilePhone(phone, "nb-NO") : false;

export const validateInputForm = (inputValues: ContactInfo): ContactInfoValidations => {
  const selectValidity = validateSelect(inputValues.internalParticipants, inputValues.externalParticipants);
  return {
    firstName: validateName(inputValues.firstName),
    lastName: validateName(inputValues.lastName),
    receiverEmail: validateEmail(inputValues.receiverEmail),
    phone: validatePhone(inputValues.phone),
    internalParticipants: selectValidity,
    externalParticipants: selectValidity,
  };
};

export const isFormValid = (inputValues: ContactInfo): boolean => {
  const validations = validateInputForm(inputValues);
  return Object.values(validations).every((val) => val);
};

export const allValuesFilled = (contactInfo: ContactInfo): boolean => {
  const selectValidity = validateSelect(contactInfo.internalParticipants, contactInfo.externalParticipants);
  const nonSelectContactInfo: BasicBooking = contactInfo;
  const filled = Object.values(nonSelectContactInfo).filter((info) => info != "");

  return selectValidity && filled.length == Object.keys(nonSelectContactInfo).length;
};

export const cabinOrderStepReady = (
  chosenCabins: CabinFragment[],
  datePick: DatePick
): { ready: boolean; errortext: string } => {
  // At least one cabin has to be selected
  if (chosenCabins.length == 0) {
    return { ready: false, errortext: "Du må velge minst en hytte å booke" };
  }
  // The user needs to enter a check-in date
  if (!datePick.checkInDate) {
    return { ready: false, errortext: "Du må velge en dato for innsjekk" };
  }
  // The user needs to enter a check-out date
  if (!datePick.checkOutDate) {
    return { ready: false, errortext: "Du må velge en dato for utsjekk" };
  }
  // The chosen range must be vaild
  if (!datePick?.isValid) {
    return { ready: false, errortext: "Den valgte perioden er ikke tilgjengelig" };
  }
  return { ready: true, errortext: "" };
};

export const toStringChosenCabins = (chosenCabins: Pick<CabinFragment, "name">[]): string[] =>
  chosenCabins.map((cabin, i) => (i > 0 ? " og " + cabin.name : cabin.name));

export const convertDateFormat = (date?: string): string => dayjs(date).format("DD-MM-YYYY");

export const getDecisionEmailInput = (
  booking: AdminBookingFragment,
  approved: boolean,
  declineMessage?: string
): SendEmailMutationVariables => {
  // omit unwanted fields
  const { checkIn, checkOut, externalParticipants, firstName, internalParticipants, lastName, phone, receiverEmail } =
    booking;

  const emailInput = {
    ...{
      checkIn,
      checkOut,
      externalParticipants,
      firstName,
      internalParticipants,
      lastName,
      phone,
      receiverEmail,
    },
    cabins: booking.cabins.map((cabin) => parseInt(cabin.id)),
    emailType: approved ? "approve_booking" : "disapprove_booking",
    extraInfo: declineMessage,
  };

  return { emailInput };
};

export const generateEmailAndBookingInput = (
  contactInfo: ContactInfo,
  datePick: DatePick,
  chosenCabins: CabinFragment[],
  extraInfo: string
): EmailInput & BookingInput => {
  return {
    ...contactInfo,
    cabins: chosenCabins.map((cabin) => parseInt(cabin.id)),
    checkIn: datePick.checkInDate,
    checkOut: datePick.checkOutDate,
    extraInfo: extraInfo,
  };
};

/*
  Checks if a date is within the fall or spring booking semester.
*/
export const dateInBookingSemester = (date: dayjs.Dayjs, bookingSemester: BookingSemesterFragment): boolean => {
  const inFallSemester = date.isBetween(bookingSemester.fallStartDate, bookingSemester.fallEndDate, null, "[]");
  const inSpringSemester = date.isBetween(bookingSemester.springStartDate, bookingSemester.springEndDate, null, "[]");

  return (
    (inFallSemester && bookingSemester.fallSemesterActive) || (inSpringSemester && bookingSemester.springSemesterActive)
  );
};

export const cabinInfoValidationSchema = Yup.object({
  oksenInternalPrice: Yup.number().typeError("Må være et tall.").min(1, "Prisen må være større enn 0."),
  bjornenInternalPrice: Yup.number().typeError("Må være et tall.").min(1, "Prisen må være større enn 0."),
  oksenExternalPrice: Yup.number().notRequired().typeError("Må være et tall.").min(1, "Prisen må være større enn 0."),
  bjornenExternalPrice: Yup.number().notRequired().typeError("Må være et tall.").min(1, "Prisen må være større enn 0."),
  oksenMaxGuests: Yup.number()
    .notRequired()
    .typeError("Må være et tall.")
    .min(1, "Antall gjester må være større enn 0."),
  bjornenMaxGuests: Yup.number()
    .notRequired()
    .typeError("Må være et tall.")
    .min(1, "Antall gjester må være større enn 0."),
});
