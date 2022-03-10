import { BookingSemester } from "@components/pages/cabins/Admin/BookingSemesterPicker";
import {
  BasicBooking,
  Cabin,
  ContactInfo,
  ContactInfoValidations,
  BookingFromQuery,
  DatePick,
  EmailAndBookingInput,
} from "@interfaces/cabins";
import dayjs from "dayjs";
import validator from "validator";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

/*
File containing helper functions for cabins.
*/

export const validateName: (name: string) => boolean = (name) => name?.length > 0;

export const validateEmail: (email: string) => boolean = (email) => (email ? validator.isEmail(email) : false);

export const validateSelect: (internalParticipants: number, externalParticipants: number) => boolean = (
  internalParticipants,
  externalParticipants
) => internalParticipants > 0 || externalParticipants > 0;

export const validatePhone: (phone: string) => boolean = (phone) =>
  phone ? validator.isMobilePhone(phone, "nb-NO") : false;

export const validateInputForm: (inputValues: ContactInfo) => ContactInfoValidations = (inputValues) => {
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

export const isFormValid: (inputValues: ContactInfo) => boolean = (inputValues) => {
  const validations = validateInputForm(inputValues);
  return Object.values(validations).every((val) => val);
};

export const allValuesFilled: (contactInfo: ContactInfo) => boolean = (contactInfo) => {
  const selectValidity = validateSelect(contactInfo.internalParticipants, contactInfo.externalParticipants);
  const nonSelectContactInfo: BasicBooking = contactInfo;
  const filled = Object.values(nonSelectContactInfo).filter((info) => info != "");

  return selectValidity && filled.length == Object.keys(nonSelectContactInfo).length;
};

export const cabinOrderStepReady: (
  chosenCabins: Cabin[],
  datePick: DatePick
) => { ready: boolean; errortext: string } = (chosenCabins, datePick) => {
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

export const toStringChosenCabins: (chosenCabins: Cabin[]) => string[] = (chosenCabins) =>
  chosenCabins.map((cabin, i) => (i > 0 ? " og " + cabin.name : cabin.name));

export const calculatePrice: (
  chosenCabins: Cabin[],
  contactInfo: ContactInfo,
  datePick: DatePick
) => number | undefined = (chosenCabins, contactInfo, datePick) => {
  const internalPrice = contactInfo.internalParticipants >= contactInfo.externalParticipants;
  const pricePerNight = chosenCabins
    .map((cabin) => (internalPrice ? cabin.internalPrice : cabin.externalPrice))
    .reduce((sum, currentPrice) => sum + currentPrice);

  if (datePick.checkInDate && datePick.checkOutDate) {
    const checkOutDate = dayjs(datePick.checkOutDate);
    const rangeLength = checkOutDate.diff(datePick.checkInDate, "day");
    return pricePerNight * rangeLength;
  }
};

export const convertDateFormat: (date: string) => string = (date) => dayjs(date).format("DD-MM-YYYY");

export const getDecisionEmailProps = (booking: BookingFromQuery, approved: boolean, declineMessage?: string) => {
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

  return { variables: { emailInput: emailInput } };
};

export const generateEmailAndBookingInput: (
  contactInfo: ContactInfo,
  datePick: DatePick,
  chosenCabins: Cabin[],
  extraInfo: string
) => EmailAndBookingInput = (contactInfo, datePick, chosenCabins, extraInfo) => {
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
export const dateInBookingSemester = (date: dayjs.Dayjs, bookingSemester: BookingSemester): boolean => {
  const inFallSemester = date.isBetween(bookingSemester.fallStartDate, bookingSemester.fallEndDate, null, "[]");
  const inSpringSemester = date.isBetween(bookingSemester.springStartDate, bookingSemester.springEndDate, null, "[]");

  return (
    (inFallSemester && bookingSemester.fallSemesterActive) || (inSpringSemester && bookingSemester.springSemesterActive)
  );
};
