"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { SelectGradeYears } from "./SelectGradeYears";

type SignUpFormType = {
  capacity: number;
  signUpsRetractable: boolean;
  signUpsRequireUserProvidedInformation: boolean;
  slots: { capacity: number; gradeYears?: number[] | null }[];
  advancedSlotDistribution: boolean;
  signUpsStartAt: string;
  signUpsEndAt: string;
  gradeYears?: number[] | null;
};

const signUpEventValidationSchema = z
  .object({
    capacity: z.coerce.number().int().min(0, "Må være større enn eller lik 0"),
    signUpsRetractable: z.boolean().default(true),
    signUpsStartAt: z.coerce.date().min(new Date(), "Må være i fremtiden"),
    signUpsEndAt: z.coerce.date().min(new Date(), "Må være i fremtiden"),
    slots: z.array(
      z.object({
        capacity: z.coerce.number().int().min(0, "Må være større enn eller lik 0"),
        gradeYears: z
          .array(
            z.coerce.number().int().min(0, "Må være større enn eller lik 0").max(5, "Må være mindre enn eller lik 5")
          )
          .nullish(),
      })
    ),
  })
  .refine(
    ({ signUpsStartAt, signUpsEndAt }) => {
      return signUpsStartAt < signUpsEndAt;
    },
    {
      message: "Sluttidspunktet for påmelding må være etter starttidspunktet",
      path: ["signUpsEndAt"],
    }
  );

type Props = {
  onSubmit: (values: SignUpFormType) => void;
  defaultValues: Partial<SignUpFormType>;
  id: string;
};

function SignUpForm({ onSubmit, defaultValues, id }: Props) {
  const methods = useForm<SignUpFormType>({
    defaultValues,
    resolver: zodResolver(signUpEventValidationSchema),
  });
  const {
    register,
    watch,
    control,
    formState: { errors },
    handleSubmit,
  } = methods;
  const { fields, prepend, remove } = useFieldArray({ control, name: "slots" });
  const useAdvancedSlotDistribution = watch("advancedSlotDistribution");

  return (
    <FormProvider {...methods}>
      <form id={id} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              type="datetime-local"
              label="Påmelding åpner"
              {...register("signUpsStartAt")}
              error={Boolean(errors.signUpsStartAt)}
              helperText={errors.signUpsStartAt?.message ?? " "}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              type="datetime-local"
              label="Påmelding stenger"
              {...register("signUpsEndAt")}
              error={Boolean(errors.signUpsEndAt)}
              helperText={errors.signUpsEndAt?.message ?? " "}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Stack>

          <Divider />
          <Typography variant="subtitle2">Plassfordeling</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              {...register("capacity")}
              label="Totalt antall plasser"
              required
              type="number"
              helperText={errors?.capacity?.message ?? " "}
              error={Boolean(errors?.capacity)}
            />
            <SelectGradeYears
              name="gradeYears"
              disabled={useAdvancedSlotDistribution}
              fullWidth
              helperText={
                useAdvancedSlotDistribution && (
                  <Typography variant="inherit">Denne brukes ikke med avansert plassfordeling</Typography>
                )
              }
            />
          </Stack>
          <Controller
            control={control}
            name="advancedSlotDistribution"
            render={({ field }) => (
              <FormControl>
                <FormControlLabel control={<Switch {...field} />} label="Bruk avansert plassfordeling" />
              </FormControl>
            )}
          />
          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column">
              <Typography variant="subtitle1">Avansert plassforedling</Typography>
              <Typography variant="caption">
                Her er det mulig å spesifisere antall plasser for forskjellige grupper. Dersom det er like mange
                påmeldte som det er plasser totalt på arrangementet så vil arrangementet være fullt, selv om det skulle
                være ledige plasser i enkelte grupper, og motsatt: dersom alle gruppene er fulle så vil arrangementet
                være fullt selv om det er ledige plasser totalt.
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="column" spacing={2}>
            <Stack direction="row" justifyContent="flex-end">
              <Button
                onClick={() => prepend({ capacity: 0, gradeYears: null })}
                variant="text"
                color="secondary"
                startIcon={<Add />}
                size="small"
              >
                Ny fordeling
              </Button>
            </Stack>
            <Stack direction="column" maxHeight="500px" minHeight="200px" overflow="auto" pt={2}>
              {fields.map((field, index) => (
                <Stack direction="row" key={field.id} spacing={2}>
                  <TextField
                    size="small"
                    disabled={!useAdvancedSlotDistribution}
                    {...register(`slots.${index}.capacity` as const)}
                    label="Antall plasser"
                    type="number"
                    error={Boolean(errors.slots?.[index]?.capacity)}
                    helperText={errors.slots?.[index]?.capacity?.message ?? " "}
                    sx={{ width: "15rem" }}
                  />
                  <SelectGradeYears
                    size="small"
                    disabled={!useAdvancedSlotDistribution}
                    name={`slots.${index}.gradeYears` as const}
                    fullWidth
                  />
                  <Box>
                    <IconButton size="small" disabled={!useAdvancedSlotDistribution} onClick={() => remove(index)}>
                      <Delete />
                    </IconButton>
                    <FormHelperText> </FormHelperText>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
}

export { SignUpForm };
export type { SignUpFormType };
