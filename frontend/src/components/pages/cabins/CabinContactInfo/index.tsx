import { useQuery } from "@apollo/client/react";
import { GET_USER } from "@graphql/users/queries";
import { ContactInfo, InputFieldsEvent, ContactInfoValidations } from "@interfaces/cabins";
import { User } from "@interfaces/users";
import { Grid } from "@material-ui/core";
import { NextPage } from "next";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { InputFields } from "../InputFields/NewInputFields";

interface ContractInfoProps {
  contactInfo: ContactInfo;
  setContactInfo: Dispatch<SetStateAction<ContactInfo>>;
  validations: ContactInfoValidations | undefined;
  errorTrigger: boolean;
}

const CabinContactInfo: NextPage<ContractInfoProps> = ({ contactInfo, setContactInfo, validations, errorTrigger }) => {
  const { data } = useQuery<{ user: User }>(GET_USER);

  useEffect(() => {
    if (data?.user) {
      let fname =
        data.user.lastName == "" ? data.user.firstName.split(" ").slice(0, -1).join(" ") : data.user.firstName;
      let lname = data.user.lastName == "" ? data.user.lastName.split(" ").slice(-1).join(" ") : data.user.lastName;

      // switch if fname is and empty string
      if (fname == "") {
        const temp = fname;
        fname = lname;
        lname = temp;
      }

      setContactInfo({
        ...contactInfo,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
      });
    }
  }, [data]);

  const handleInputChange = (name: string, event: InputFieldsEvent) => {
    setContactInfo({ ...contactInfo, [name]: event.target.value });
  };

  return (
    <Grid container>
      <InputFields
        onChange={handleInputChange}
        contactInfo={contactInfo}
        validations={validations}
        errorTrigger={errorTrigger}
      ></InputFields>
    </Grid>
  );
};

export default CabinContactInfo;
