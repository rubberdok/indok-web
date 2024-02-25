import { Typography } from "@mui/material";
import React from "react";

import { useStepContext } from "./StepContext";
import { CheckInOut } from "./Steps/CarSelection";
import { CarContactInfo, ContactInfo } from "./Steps/ContactInfo";
import { Contract } from "./Steps/Contract";
import { ExtraInfoSite } from "./Steps/QuestionsAboutBooking";
import { ReceiptSite } from "./Steps/Receipt";
import { PaymentSite } from "./Steps/Review";

import { BookingProductFragment } from "@/generated/graphql";
import dayjs from "@/lib/date";

type Props = {
  allCars: BookingProductFragment[];
  chosenCars: BookingProductFragment[];
  contactInfo: ContactInfo | undefined;
  onContactInfoChange: (contactInfo: ContactInfo) => void;
  onCarsChange: (cars: BookingProductFragment[]) => void;
  setExtraInfo: React.Dispatch<React.SetStateAction<string>>;
  onDateChange: (date: dayjs.Dayjs) => void;
  startDate: dayjs.Dayjs | undefined;
  endDate: dayjs.Dayjs | undefined;
  onSubmitBooking: () => void;
};

export const BookingSteps: React.FC<Props> = ({
  allCars,
  chosenCars,
  onCarsChange,
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
      // Choose car
      return (
        <CheckInOut
          allCars={allCars}
          chosenCars={chosenCars}
          onCarsChange={onCarsChange}
          onDateChange={onDateChange}
          startDate={startDate}
          endDate={endDate}
          onNext={nextStep}
        />
      );
    case 1:
      // Choose contact info
      return (
        <CarContactInfo
          contactInfo={contactInfo}
          chosenCars={chosenCars}
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
        <ExtraInfoSite setExtraInfo={setExtraInfo} chosenCars={chosenCars} startDate={startDate} endDate={endDate} />
      );
    case 3:
      // Approve rental terms
      return <Contract chosenCars={chosenCars} startDate={startDate} endDate={endDate} contactInfo={contactInfo} />;
    case 4:
      // Payment
      return (
        <PaymentSite
          chosenCars={chosenCars}
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
          chosenCars={chosenCars}
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
