import { useQuery } from "@apollo/client";
import { ExpandMoreRounded } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { AllCategoriesDocument, UserOrganizationsDocument } from "@/generated/graphql";

import { IEventForm } from "../../schema";

import { Errors } from "./Errors";
import { ReviewItem } from "./ReviewItem";

export const Info: React.FC = () => {
  const { watch } = useFormContext<IEventForm>();

  const { data } = useQuery(AllCategoriesDocument);
  const { data: orgData } = useQuery(UserOrganizationsDocument);
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreRounded />}>
        <Stack direction="column" spacing={1}>
          <Typography variant="inherit">Informasjon</Typography>
          <Errors step="info" />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" spacing={2}>
          <Typography variant="subtitle1">Om</Typography>
          <ReviewItem label="Tittel" value={watch("info.title")} />
          <ReviewItem label="Beskrivelse" value={watch("info.description")} />
          <ReviewItem label="Kort beskrivelse" value={watch("info.shortDescription")} />

          <Typography variant="subtitle1">Klassetrinn og kategori</Typography>
          <ReviewItem
            label="Klassetrinn"
            value={() => {
              const gradeYears = watch("info.gradeYears");
              if (gradeYears.length === 0 ?? gradeYears.length === 5) return "Alle";
              return gradeYears.map((val) => `${val}. klasse`).join(", ");
            }}
          />
          <ReviewItem
            label="Kategori"
            value={() => {
              const category = watch("info.category");
              return data?.allCategories?.find((cat) => cat.id === category)?.name;
            }}
          />

          <Typography variant="subtitle1">Arrangør og kontaktinformasjon</Typography>
          <ReviewItem
            label="Arrangør"
            value={() => {
              const organizer = watch("info.organizer");
              return orgData?.user?.organizations?.find((org) => org.id === organizer)?.name;
            }}
          />
          <ReviewItem label="Kontakt (e-post)" value={watch("info.contactEmail")} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
