import { Typography } from "@mui/material";
import dayjs from "dayjs";
import React from "react";

import { CabinFragment } from "@/generated/graphql";

import { useStepContext } from "./StepContext";
import { CheckInOut } from "./Steps/CabinSelection";
import { CabinContactInfo, ContactInfo } from "./Steps/ContactInfo";
import { Contract } from "./Steps/Contract";
import { ExtraInfoSite } from "./Steps/QuestionsAboutBooking";
import { ReceiptSite } from "./Steps/Receipt";
import { PaymentSite } from "./Steps/Review";

type Props = {
  allCabins: CabinFragment[];
  chosenCabins: CabinFragment[];
  contactInfo: ContactInfo | undefined;
  onContactInfoChange: (contactInfo: ContactInfo) => void;
  onCabinsChange: (cabins: CabinFragment[]) => void;
  setExtraInfo: React.Dispatch<React.SetStateAction<string>>;
  onDateChange: (date: dayjs.Dayjs) => void;
  startDate: dayjs.Dayjs | undefined;
  endDate: dayjs.Dayjs | undefined;
  onSubmitBooking: () => void;
};

export const BookingSteps: React.FC<Props> = ({
  allCabins,
  chosenCabins,
  onCabinsChange,
  contactInfo,
  onContactInfoChange,
  onDateChange,
  startDate,
  endDate,
  setExtraInfo,
  onSubmitBooking,
}) => {
  const { activeStep, nextStep, previousStep } = useStepContext();
  switch (activeStep) {
    case 0:
      // Choose cabin
      return (
        <CheckInOut
          allCabins={allCabins}
          chosenCabins={chosenCabins}
          onCabinsChange={onCabinsChange}
          onDateChange={onDateChange}
          startDate={startDate}
          endDate={endDate}
          onNext={nextStep}
        />
      );
    case 1:
      // Choose contact info
      return (
        <CabinContactInfo
          contactInfo={contactInfo}
          chosenCabins={chosenCabins}
          onSubmit={(data) => {
            onContactInfoChange(data);
            nextStep();
          }}
          onPrevious={previousStep}
        />
      );
    case 2:
      // Extra info site
      return (
        <ExtraInfoSite
          setExtraInfo={setExtraInfo}
          chosenCabins={chosenCabins}
          startDate={startDate}
          endDate={endDate}
        />
      );
    case 3:
      // Approve rental terms
      return <Contract chosenCabins={chosenCabins} startDate={startDate} endDate={endDate} contactInfo={contactInfo} />;
    case 4:
      // Payment
      return (
        <PaymentSite
          chosenCabins={chosenCabins}
          startDate={startDate}
          endDate={endDate}
          contactInfo={contactInfo}
          onSubmitBooking={onSubmitBooking}
        />
      );
    case 5:
      // Receipt
      return (
        <ReceiptSite
          chosenCabins={chosenCabins}
          startDate={startDate}
          endDate={endDate}
          contactInfo={contactInfo}
          mailSent
        />
      );

    default:
      return <Typography>Step not found</Typography>;
  }
};
