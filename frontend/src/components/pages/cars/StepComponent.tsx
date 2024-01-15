import { Typography } from "@mui/material";
import React from "react";

import { CarFragment } from "@/generated/graphql";
import { ContactInfo, ContactInfoValidations, DatePick } from "@/types/cars";

import { CarContactInfo } from "./CarContactInfo";
import { CheckInOutCar } from "./CheckInOut";
import { ExtraInfoSite } from "./ExtraInfoSite";
import { PaymentSite } from "./PaymentSite";
import { ReceiptSite } from "./ReceiptSite";

type Props = {
  activeStep: number;
  allCars: CarFragment[];
  chosenCars: CarFragment[];
  contactInfo: ContactInfo;
  datePick: DatePick;
  validations?: ContactInfoValidations;
  errorTrigger: boolean;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;
  setChosenCars: React.Dispatch<React.SetStateAction<CarFragment[]>>;
  setDatePick: React.Dispatch<React.SetStateAction<DatePick>>;
  setExtraInfo: React.Dispatch<React.SetStateAction<string>>;
};

export const StepComponent: React.FC<Props> = (props) => {
  switch (props.activeStep) {
    case 0:
      // Choose car
      return (
        <CheckInOutCar
          allCars={props.allCars}
          chosenCars={props.chosenCars}
          setChosenCars={props.setChosenCars}
          setDatePick={props.setDatePick}
        />
      );
    case 1:
      // Choose contact info
      return (
        <CarContactInfo
          contactInfo={props.contactInfo}
          setContactInfo={props.setContactInfo}
          validations={props.validations}
          errorTrigger={props.errorTrigger}
          chosenCars={props.chosenCars}
        />
      );
    case 2:
      // Extra info site
      return (
        <ExtraInfoSite setExtraInfo={props.setExtraInfo} chosenCars={props.chosenCars} datePick={props.datePick} />
      );
    case 3:
      // Payment
      return <PaymentSite chosenCars={props.chosenCars} datePick={props.datePick} contactInfo={props.contactInfo} />;
    case 4:
      // Receipt
      return (
        <ReceiptSite chosenCars={props.chosenCars} datePick={props.datePick} contactInfo={props.contactInfo} mailSent />
      );

    default:
      return <Typography>Step not found</Typography>;
  }
};
