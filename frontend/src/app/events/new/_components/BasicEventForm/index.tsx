"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Email, LocationOn } from "@mui/icons-material";
import { Stack, TextField, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Link } from "@/app/components/Link";

import { SelectCategories } from "./SelectCategories";
import { SelectOrganization } from "./SelectOrganization";

type BasicEventFormType = {
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  location?: string | null;
  startAt: string;
  endAt: string;
  contactEmail?: string | null;
  categories?: string[] | null;
  organizationId: string;
};
const descriptionPlaceholderText = `### Overskrifter

[Lenke til noe](https://indokntnu.no)

* Punkt 1
* Punkt 2`;

type Props = {
  organizations: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  id: string;
  onSubmit: (values: BasicEventFormType) => void;
  defaultValues: Partial<BasicEventFormType>;
};

const basicEventValidationSchema = z
  .object({
    name: z.string().min(1).max(100),
    description: z.string().max(10000).nullish(),
    shortDescription: z.string().max(100).nullish(),
    location: z.string().max(100).nullish(),
    contactEmail: z.union([z.string().email(), z.literal("")]),
    startAt: z.coerce.date().min(new Date(), "Starttidspunktet må være i fremtiden"),
    endAt: z.coerce.date().min(new Date(), "Sluttidspunktet må være i fremtiden"),
    organizationId: z.string().uuid(),
    categories: z.array(z.string().uuid()).nullish(),
  })
  .refine(
    ({ startAt, endAt }) => {
      return startAt < endAt;
    },
    {
      message: "Sluttidspunktet må være etter starttidspunktet",
      path: ["endAt"],
    }
  );

function BasicEventForm({ organizations, categories, id, onSubmit, defaultValues }: Props) {
  const methods = useForm<BasicEventFormType>({
    defaultValues,
    resolver: zodResolver(basicEventValidationSchema),
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = methods;

  return (
    <FormProvider {...methods}>
      <form id={id} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              {...register("name")}
              label="Navn på arrangementet"
              required
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name?.message ?? " "}
            />
            <SelectOrganization organizations={organizations} />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              {...register("startAt")}
              label="Starttid"
              required
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              helperText={errors.startAt?.message ?? " "}
              error={Boolean(errors.startAt)}
            />
            <TextField
              {...register("endAt")}
              label="Sluttid"
              required
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              helperText={errors.endAt?.message ?? " "}
              error={Boolean(errors.endAt)}
            />
          </Stack>

          <TextField
            {...register("description")}
            label="Beskrivelse"
            multiline
            minRows={3}
            maxRows={10}
            fullWidth
            placeholder={descriptionPlaceholderText}
            error={Boolean(errors.description)}
            helperText={
              errors.description?.message ?? (
                <Typography variant="inherit" component="span">
                  Beskrivelsen kan bruke markdown for formattering,{" "}
                  <Link target="_blank" href="https://www.markdownguide.org/cheat-sheet/">
                    trykk her for en guide
                  </Link>
                </Typography>
              )
            }
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              {...register("shortDescription")}
              label="Kort beskrivelse"
              fullWidth
              error={Boolean(errors.shortDescription)}
              placeholder="Årets kuleste arrangement..."
              helperText={
                errors.shortDescription?.message ?? (
                  <Typography variant="inherit" component="span">
                    Vises i oversikten over arrangementer
                  </Typography>
                )
              }
            />
            <SelectCategories categories={categories} />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              {...register("location")}
              label="Sted"
              fullWidth
              error={Boolean(errors.location)}
              helperText={errors.location?.message ?? " "}
              InputProps={{
                endAdornment: <LocationOn color="action" />,
              }}
            />
            <TextField
              {...register("contactEmail")}
              label="Kontakt (e-post)"
              fullWidth
              type="email"
              error={Boolean(errors.contactEmail)}
              helperText={errors.contactEmail?.message ?? " "}
              InputProps={{
                endAdornment: <Email color="action" />,
              }}
            />
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
}

export { BasicEventForm, basicEventValidationSchema };
export type { BasicEventFormType };
