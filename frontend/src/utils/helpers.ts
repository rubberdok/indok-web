import { InputValueTypes } from "@interfaces/cabins";

export const allValuesDefined = (obj: InputValueTypes): boolean => {
  let empty = true;
  Object.values(obj).forEach((val) => {
    if (val === undefined && val != 0) {
      empty = false;
    }
  });
  return empty;
};
