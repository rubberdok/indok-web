import { useQuery } from "@apollo/client/react";
import { Grid } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import { CarFragment, UserDocument } from "@/generated/graphql";
import { ContactInfo, ContactInfoValidations, InputFieldsEvent } from "@/types/cars";

import { InputFields } from "../InputFields/InputFields";

type Props = {
  contactInfo: ContactInfo;
  setContactInfo: Dispatch<SetStateAction<ContactInfo>>;
  validations: ContactInfoValidations | undefined;
  errorTrigger: boolean;
  chosenCars: CarFragment[];
};

/**
 * One of the steps in the cars/book page.
 * Fetches the current user and tries to input its values to the InputFields.
 */
export const CarContactInfo: React.FC<Props> = ({
  contactInfo,
  setContactInfo,
  validations,
  chosenCars,
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
        chosenCars={chosenCars}
      />
    </Grid>
  );
};
