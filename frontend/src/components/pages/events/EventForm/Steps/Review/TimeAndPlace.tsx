import { ExpandMoreRounded } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";

import { IEventForm } from "../../schema";

import { Errors } from "./Errors";
import { ReviewItem } from "./ReviewItem";

export const TimeAndPlace: React.FC = () => {
  const { watch } = useFormContext<IEventForm>();

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
          <ReviewItem
            label="Starttid"
            value={dayjs(watch("timeAndPlace.start")).isValid() ? dayjs(watch("timeAndPlace.start")).format("LLL") : ""}
          />
          <ReviewItem
            label="Sluttid"
            value={dayjs(watch("timeAndPlace.start")).isValid() ? dayjs(watch("timeAndPlace.start")).format("LLL") : ""}
          />

          <Typography variant="subtitle1">Sted</Typography>
          <ReviewItem label="Lokasjon" value={watch("timeAndPlace.location")} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
