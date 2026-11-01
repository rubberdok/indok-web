import { Typography } from "@mui/material";
import { useState } from "react";

import { useStepContext } from "@/components/pages/cabins/booking/StepContext";
import { ContactFieldErrors } from "@/components/pages/janhus/validation";

import { ContactStep } from "./Steps/ContactStep";
import { ContractStep } from "./Steps/ContractStep";
import { ExtraInfoStep } from "./Steps/ExtraInfoStep";
import { ReceiptStep } from "./Steps/ReceiptStep";
import { ReviewStep } from "./Steps/ReviewStep";
import { TimeStep } from "./Steps/TimeStep";
import type { BookingStepsProps } from "./Steps/types";

export { JANHUS_OWNER_TYPE_LABELS, type JanHusOwnerType } from "./Steps/types";

export const BookingSteps: React.FC<BookingStepsProps> = (props) => {
  const { contactFieldErrors, showAllContactErrors } = props;
  const { activeStep } = useStepContext();
  // Here, not in ContactStep: which fields were touched must survive going to another step and back.
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const markTouched = (key: string) => setTouched((prev) => ({ ...prev, [key]: true }));
  const fieldError = (key: keyof ContactFieldErrors) =>
    touched[key] || showAllContactErrors ? contactFieldErrors[key] : undefined;

  switch (activeStep) {
    case 0:
      return <TimeStep {...props} />;
    case 1:
      return <ContactStep {...props} fieldError={fieldError} markTouched={markTouched} />;
    case 2:
      return <ExtraInfoStep {...props} />;
    case 3:
      return <ContractStep {...props} />;
    case 4:
      return <ReviewStep {...props} />;
    case 5:
      return <ReceiptStep {...props} />;
    default:
      return <Typography>Step not found</Typography>;
  }
};
