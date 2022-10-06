import { useQuery } from "@apollo/client/react";
import { Grid } from "@mui/material";
import { NextPage } from "next";
import { Dispatch, SetStateAction } from "react";

import { UserDocument } from "@/generated/graphql";
import { Cabin, ContactInfo, ContactInfoValidations, InputFieldsEvent } from "@/interfaces/cabins";

import { InputFields } from "../InputFields/InputFields";

interface ContractInfoProps {
  contactInfo: ContactInfo;
  setContactInfo: Dispatch<SetStateAction<ContactInfo>>;
  validations: ContactInfoValidations | undefined;
  errorTrigger: boolean;
  chosenCabins: Cabin[];
}
/**
 * One of the steps in the cabins/book page.
 * Fetches the current user and tries to input its values to the InputFields.
 */
const CabinContactInfo: NextPage<ContractInfoProps> = ({
  contactInfo,
  setContactInfo,
  validations,
  chosenCabins,
  errorTrigger,
}) => {
  useQuery(UserDocument, {
    onCompleted: (data) => {
      if (data.user) {
        setContactInfo({
          ...contactInfo,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          receiverEmail: data.user.feideEmail,
        });
      }
    },
  });

  const handleInputChange = (name: string, event: InputFieldsEvent) => {
    setContactInfo({ ...contactInfo, [name]: event.target.value });
  };

  return (
    <Grid container justifyContent="center">
      <InputFields
        onChange={handleInputChange}
        contactInfo={contactInfo}
        validations={validations}
        errorTrigger={errorTrigger}
        chosenCabins={chosenCabins}
      />
    </Grid>
  );
};

export default CabinContactInfo;
