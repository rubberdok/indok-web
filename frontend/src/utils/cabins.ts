import { InputValueTypes } from "@interfaces/cabins";
import validator from "validator";

export const validateName = (name: string) => name.length > 0;

export const validateEmail = (email: string): boolean => validator.isEmail(email);

export const validateSelect = (numberIndok: number, numberExternal: number): boolean =>
  numberIndok > 0 || numberExternal > 0;

export const validatePhone = (phone: string): boolean => (phone ? validator.isMobilePhone(phone) : false);

export const validateInputForm = (inputValues: InputValueTypes) => {
  const selectValidity = validateSelect(inputValues.numberIndok, inputValues.numberExternal);

  const updatedValidations = {
    firstname: validateName(inputValues.firstname),
    lastname: validateName(inputValues.surname),
    email: validateEmail(inputValues.receiverEmail),
    phone: validatePhone(inputValues.phone),
    numberIndok: selectValidity,
    numberExternal: selectValidity,
    triggerError: false,
  };

  return updatedValidations;
};
