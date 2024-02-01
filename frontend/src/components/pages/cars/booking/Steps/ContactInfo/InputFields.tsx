import { yupResolver } from "@hookform/resolvers/yup";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { range } from "lodash";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { CarFragment } from "@/generated/graphql";
import * as yup from "@/lib/validation";

import { Stepper } from "../Stepper";

import { ContactInfo } from ".";

type Props = {
  chosenCars: CarFragment[];
  onSubmit: (data: ContactInfo) => void;
  defaultContactInfo: Partial<ContactInfo>;
  onPrevious: () => void;
};

export function getContactInfoSchema(totalGuestsAllowed: number): yup.ObjectSchema<ContactInfo> {
  return yup.object({
    firstName: yup.string().required().label("Fornavn"),
    lastName: yup.string().required().label("Etternavn"),
    receiverEmail: yup.string().email().required().label("E-post"),
    phone: yup
      .string()
      /* Remove white space from the phone number */
      .transform((value: string) => (value ? value.replace(/\s/g, "") : value))
      .matches(/^(0047|\+47|47)?[49]\d{7}$/, { message: "Må være et gyldig telefonnummer.", excludeEmptyString: true })
      .ensure()
      .required()
      .label("Telefonnummer"),
    internalParticipants: yup
      .number()
      .min(0)
      .integer()
      .required()
      .label("Antall interne deltakere")
      .test({
        message: "Du må ha minst én deltaker",
        name: "minParticipants",
        test(value, context) {
          return value + context.parent.externalParticipants > 0;
        },
      })
      .test({
        name: "maxParticipants",
        message: `Du kan maks ha ${totalGuestsAllowed} deltakere`,
        test(value, context) {
          return value + context.parent.externalParticipants <= totalGuestsAllowed;
        },
      }),
    externalParticipants: yup.number().min(0).integer().required().label("Antall eksterne deltakere"),
  });
}

/** Component for rendering all input fields for the contact info of a booking. */
export const InputFields: React.FC<Props> = ({ defaultContactInfo, chosenCars, onSubmit, onPrevious }) => {
  const totalGuestsAllowed = chosenCars.reduce((sum, currentCar) => sum + (currentCar.maxGuests || 0), 0);

  const { firstName, externalParticipants, internalParticipants, lastName, phone, receiverEmail } = defaultContactInfo;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContactInfo>({
    resolver: yupResolver(getContactInfoSchema(totalGuestsAllowed)),
    values: {
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      receiverEmail: receiverEmail ?? "",
      phone: phone ?? "",
      internalParticipants: internalParticipants ?? 0,
      externalParticipants: externalParticipants ?? 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" justifyContent="center">
        <Typography variant="h3" textAlign="center" gutterBottom>
          Kontaktinfo
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} columnGap={2}>
          <TextField
            type="text"
            label="Fornavn"
            autoComplete="given-name"
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("firstName")}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message ?? " "}
          />
          <TextField
            type="text"
            label="Etternavn"
            autoComplete="family-name"
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("lastName")}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName?.message ?? " "}
          />
        </Stack>
        <Stack direction={{ xs: "column", md: "row" }} columnGap={2}>
          <TextField
            type="email"
            label="E-postadresse"
            autoComplete="email"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            {...register("receiverEmail")}
            error={Boolean(errors.receiverEmail)}
            helperText={errors.receiverEmail?.message ?? " "}
          />
          <TextField
            type="tel"
            label="Mobilnummer"
            autoComplete="tel"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            {...register("phone")}
            error={Boolean(errors.phone)}
            helperText={errors.phone?.message ?? " "}
          />
        </Stack>
        <Stack direction={{ xs: "column", md: "row" }} columnGap={2}>
          <Controller
            name="internalParticipants"
            control={control}
            render={({ field }) => (
              <FormControl variant="filled" fullWidth error={Boolean(errors.internalParticipants)} required>
                <InputLabel id="internal-participants-label">Antall indøkere</InputLabel>
                <Select {...field} labelId="internal-participants-label" id="internal-participants">
                  {range(0, totalGuestsAllowed + 1).map((val: number) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={Boolean(errors.internalParticipants)}>
                  {errors.internalParticipants?.message ?? " "}
                </FormHelperText>
              </FormControl>
            )}
          />
          <Controller
            name="externalParticipants"
            control={control}
            render={({ field }) => (
              <FormControl variant="filled" fullWidth error={Boolean(errors.externalParticipants)} required>
                <InputLabel id="external-participants-label">Antall eksterne</InputLabel>
                <Select {...field} labelId="external-participants-label" id="external-participants">
                  {range(0, totalGuestsAllowed + 1).map((val: number) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={Boolean(errors.externalParticipants)}>
                  {errors.externalParticipants?.message ?? " "}
                </FormHelperText>
              </FormControl>
            )}
          />
        </Stack>
      </Stack>
      <Stepper
        backButton={
          <Button variant="contained" startIcon={<KeyboardArrowLeft />} onClick={() => onPrevious()}>
            Tilbake
          </Button>
        }
        nextButton={
          <Button variant="contained" endIcon={<KeyboardArrowRight />} type="submit">
            Neste
          </Button>
        }
      />

      <Stack direction="row" justifyContent="flex-end" columnGap={2}></Stack>
    </form>
  );
};
