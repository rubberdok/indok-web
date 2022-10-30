import { ExpandMoreRounded } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";

import { IEventForm } from "../schema";

import { Errors } from "./Errors";
import { ReviewItem } from "./ReviewItem";

export const Registration: React.FC = () => {
  const { watch } = useFormContext<IEventForm>();

  const registration = watch("registration.isAttendable");
  const binding = watch("registration.details.binding");
  let title: string;

  if (registration && binding) title = "Bindende påmelding";
  else if (registration) title = "Påmelding";
  else title = "Påmelding (deaktivert)";

  return (
    <Accordion disabled={!registration}>
      <AccordionSummary expandIcon={<ExpandMoreRounded />}>
        <Stack direction="column" spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="inherit">{title}</Typography>
          </Stack>
          <Errors step="registration" />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle1">Tider for påmelding</Typography>
          <ReviewItem
            label="Påmelding åpner"
            value={
              dayjs(watch("registration.details.signUpOpen")).isValid()
                ? dayjs(watch("registration.details.signUpOpen")).format("L LT")
                : ""
            }
          />
          <ReviewItem
            label="Påmelding slutter"
            value={
              dayjs(watch("registration.details.deadline")).isValid()
                ? dayjs(watch("registration.details.deadline")).format("L LT")
                : ""
            }
          />

          <Typography variant="subtitle1">Plasser</Typography>
          <ReviewItem label="Antall plasser" value={watch("registration.details.availableSeats")} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
