import { ContactInfo, InputFieldsEvent, Validations } from "@interfaces/cabins";
import { Grid } from "@material-ui/core";
import { NextPage } from "next";
import React, { Dispatch, SetStateAction } from "react";
import { InputFields } from "../InputFields/NewInputFields";

interface ContractInfoProps {
  contactInfo: ContactInfo;
  setContactInfo: Dispatch<SetStateAction<ContactInfo>>;
  validations: Validations | undefined;
}

const CabinContactInfo: NextPage<ContractInfoProps> = ({ contactInfo, setContactInfo, validations }) => {
  const handleInputChange = (name: string, event: InputFieldsEvent) => {
    setContactInfo({ ...contactInfo, [name]: event.target.value });
  };

  return (
    <Grid container>
      <InputFields onChange={handleInputChange} contactInfo={contactInfo} validations={validations}></InputFields>
    </Grid>
  );
};

export default CabinContactInfo;
