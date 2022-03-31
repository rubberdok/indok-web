import { Cabin } from "@interfaces/cabins";
import { Input, TextField } from "@material-ui/core";
import React from "react";

type Props = {
  handleOnChange: (arg0: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, arg1?: Cabin) => void;
  name: string;
  cabin?: Cabin;
  value?: number;
};

const cabinInfoMap = new Map<string, string>([
  ["internalPrice", "Internpris"],
  ["externalPrice", "Eksternpris"],
  ["maxGuests", "Antall sengeplasser"],
]);

const CabinInfoInput: React.VFC<Props> = ({ cabin, handleOnChange, name, value }) => {
  return (
    <TextField
      fullWidth
      label={cabinInfoMap.get(name)}
      name={name}
      value={value}
      onChange={(e) => handleOnChange(e, cabin)}
      type="number"
      margin="dense"
      InputLabelProps={{ shrink: true }}
    />
  );
};

export default CabinInfoInput;
