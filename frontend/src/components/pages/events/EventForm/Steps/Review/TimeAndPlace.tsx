import { ExpandMoreRounded } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import dayjs from "@/lib/date";

import { IEventForm } from "../../schema";

import { Errors } from "./Errors";
import { ReviewItem } from "./ReviewItem";

export const TimeAndPlace: React.FC = () => {
  const { watch } = useFormContext<IEventForm>();
  const startTime = dayjs(watch("timeAndPlace.start")).tz("Europe/Oslo");
  const endTime = dayjs(watch("timeAndPlace.end")).tz("Europe/Oslo");

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreRounded />}>
        <Stack direction="column" spacing={1}>
          <Typography variant="inherit">Tid/Sted</Typography>
          <Errors step="timeAndPlace" />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle1">Tid</Typography>
          <ReviewItem label="Starttid" value={startTime.isValid() ? startTime.format("LLL") : ""} />
          <ReviewItem label="Sluttid" value={endTime.isValid() ? endTime.format("LLL") : ""} />

          <Typography variant="subtitle1">Sted</Typography>
          <ReviewItem label="Lokasjon" value={watch("timeAndPlace.location")} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
