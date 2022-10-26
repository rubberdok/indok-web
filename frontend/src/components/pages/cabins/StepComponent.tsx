import { Typography } from "@mui/material";
import React from "react";

import { CabinFragment } from "@/generated/graphql";
import { ContactInfo, ContactInfoValidations, DatePick } from "@/types/cabins";

import { CabinContactInfo } from "./CabinContactInfo";
import { CheckInOut } from "./CheckInOut";
import { ExtraInfoSite } from "./ExtraInfoSite";
import { PaymentSite } from "./PaymentSite";
import { ReceiptSite } from "./ReceiptSite";

type Props = {
  activeStep: number;
  allCabins: CabinFragment[];
  chosenCabins: CabinFragment[];
  contactInfo: ContactInfo;
  datePick: DatePick;
  validations?: ContactInfoValidations;
  errorTrigger: boolean;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;
  setChosenCabins: React.Dispatch<React.SetStateAction<CabinFragment[]>>;
  setDatePick: React.Dispatch<React.SetStateAction<DatePick>>;
  setExtraInfo: React.Dispatch<React.SetStateAction<string>>;
};

export const StepComponent: React.FC<React.PropsWithChildren<Props>> = (props) => {
  switch (props.activeStep) {
    case 0:
      // Choose cabin
      return (
        <CheckInOut
          allCabins={props.allCabins}
          chosenCabins={props.chosenCabins}
          setChosenCabins={props.setChosenCabins}
          setDatePick={props.setDatePick}
        />
      );
    case 1:
      // Choose contact info
      return (
        <CabinContactInfo
          contactInfo={props.contactInfo}
          setContactInfo={props.setContactInfo}
          validations={props.validations}
          errorTrigger={props.errorTrigger}
          chosenCabins={props.chosenCabins}
        />
      );
    case 2:
      // Extra info site
      return (
        <ExtraInfoSite setExtraInfo={props.setExtraInfo} chosenCabins={props.chosenCabins} datePick={props.datePick} />
      );
    case 3:
      // Payment
      return (
        <PaymentSite chosenCabins={props.chosenCabins} datePick={props.datePick} contactInfo={props.contactInfo} />
      );
    case 4:
      // Receipt
      return (
        <ReceiptSite
          chosenCabins={props.chosenCabins}
          datePick={props.datePick}
          contactInfo={props.contactInfo}
          mailSent
        />
      );

    default:
      return <Typography>Step not found</Typography>;
  }
};
