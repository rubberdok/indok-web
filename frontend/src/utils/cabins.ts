import { Cabin, ContactInfo, ContactInfoValidations } from "@interfaces/cabins";
import dayjs from "dayjs";
import { DatePick } from "src/pages/cabins/book";
import validator from "validator";

export const validateName = (name: string) => name?.length > 0;

export const validateEmail = (email: string): boolean => (email ? validator.isEmail(email) : false);

export const validateSelect = (internalParticipants: number, externalParticipants: number): boolean =>
  internalParticipants > 0 || externalParticipants > 0;

export const validatePhone = (phone: string): boolean => (phone ? validator.isMobilePhone(phone, "nb-NO") : false);

export const validateInputForm = (inputValues: ContactInfo) => {
  const selectValidity = validateSelect(inputValues.internalParticipants, inputValues.externalParticipants);

  const updatedValidations: ContactInfoValidations = {
    firstname: validateName(inputValues.firstname),
    lastname: validateName(inputValues.lastname),
    receiverEmail: validateEmail(inputValues.receiverEmail),
    phone: validatePhone(inputValues.phone),
    internalParticipants: selectValidity,
    externalParticipants: selectValidity,
  };

  return updatedValidations;
};

export const isFormValid = (inputValues: ContactInfo) => {
  const validations = validateInputForm(inputValues);

  return Object.values(validations).every((val) => val);
};

export const allValuesFilled = (contactInfo: ContactInfo) => {
  const selectValidity = validateSelect(contactInfo.internalParticipants, contactInfo.externalParticipants);

  const { internalParticipants, externalParticipants, ...nonSelectContactInfo } = contactInfo;
  const filled = Object.values(nonSelectContactInfo).filter((info) => info != "" || info != 0);

  return selectValidity && filled.length == Object.keys(nonSelectContactInfo).length;
};

export const cabinOrderStepReady = (
  chosenCabins: Cabin[],
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

export const toStringChosenCabins = (chosenCabins: Cabin[]) =>
  chosenCabins.map((cabin, i) => (i > 0 ? " og " + cabin.name : cabin.name));

export const calculatePrice = (chosenCabins: Cabin[], contactInfo: ContactInfo, datePick: DatePick) => {
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

export const generateEmailInput = (contactInfo: ContactInfo, datePick: DatePick, chosenCabins: Cabin[]) => {
  return {
    ...contactInfo,
    cabins: chosenCabins.map((cabin) => cabin.id),
    checkIn: datePick.checkInDate,
    checkOut: datePick.checkOutDate,
  };
};
