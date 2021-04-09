import { Cabin, ContactInfo } from "@interfaces/cabins";
import dayjs from "dayjs";
import { DatePick } from "src/pages/cabins/book";
import validator from "validator";

export const validateName = (name: string) => name?.length > 0;

export const validateEmail = (email: string): boolean => (email ? validator.isEmail(email) : false);

export const validateSelect = (numberIndok: number, numberExternal: number): boolean =>
  numberIndok > 0 || numberExternal > 0;

export const validatePhone = (phone: string): boolean => (phone ? validator.isMobilePhone(phone, "nb-NO") : false);

export const validateInputForm = (inputValues: ContactInfo) => {
  const selectValidity = validateSelect(inputValues.numberIndok, inputValues.numberExternal);

  const updatedValidations = {
    firstName: validateName(inputValues.firstName),
    lastName: validateName(inputValues.lastName),
    email: validateEmail(inputValues.email),
    phone: validatePhone(inputValues.phone),
    numberIndok: selectValidity,
    numberExternal: selectValidity,
  };

  return updatedValidations;
};

export const isFormValid = (inputValues: ContactInfo) => {
  const validations = validateInputForm(inputValues);

  return Object.values(validations).every((val) => val);
};

export const allValuesFilled = (contactInfo: ContactInfo) => {
  const selectValidity = validateSelect(contactInfo.numberIndok, contactInfo.numberExternal);

  const { numberIndok, numberExternal, ...nonSelectContactInfo } = contactInfo;
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
  const internalPrice = contactInfo.numberIndok >= contactInfo.numberExternal;
  const pricePerNight = chosenCabins
    .map((cabin) => (internalPrice ? cabin.internalPrice : cabin.externalPrice))
    .reduce((sum, currentPrice) => sum + currentPrice);

  if (datePick.checkInDate && datePick.checkOutDate) {
    const checkOutDate = dayjs(datePick.checkOutDate);
    const rangeLength = checkOutDate.diff(datePick.checkInDate, "day");
    return pricePerNight * rangeLength;
  }
};

export const generateAdminEmailInput = (contactInfo: ContactInfo, datePick: DatePick, chosenCabins: Cabin[]) => {
  const rangeLength = dayjs(datePick.checkOutDate).diff(dayjs(datePick.checkInDate), "d");
  return {
    ...contactInfo,
    cabinIds: chosenCabins.map((cabin) => cabin.id),
    checkInDate: datePick.checkInDate,
    checkOutDate: datePick.checkOutDate,
    rangeLength: rangeLength,
  };
};
