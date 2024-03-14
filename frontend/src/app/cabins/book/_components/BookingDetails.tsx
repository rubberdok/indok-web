"use client";

import { graphql } from "@/gql/app";
import { skipToken, useSuspenseQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  FormHelperText,
  Unstable_Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { range } from "lodash";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

type BookingDetailsFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  internalParticipants: number;
  externalParticipants: number;
};

type Props = {
  bookingDetails: BookingDetailsFields;
  onSubmit: (bookingDetails: BookingDetailsFields) => void;
  selectedCabins: { id: string; capacity: number }[];
  dates: { start: Date | undefined; end: Date | undefined };
  onPrevious: () => void;
};

function BookingDetails({ bookingDetails, selectedCabins, onSubmit, onPrevious, dates }: Props) {
  const totalGuestsAllowed = selectedCabins.reduce((sum, currentCabin) => sum + currentCabin.capacity, 0);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<BookingDetailsFields>({
    resolver: yupResolver(getBookingDetailsSchema(totalGuestsAllowed)),
    defaultValues: bookingDetails,
  });

  const internalParticipants = watch("internalParticipants");
  const externalParticipants = watch("externalParticipants");

  const { data } = useSuspenseQuery(
    graphql(`
      query BookingDetails_TotalCost($data: TotalCostInput!) {
        totalCost(data: $data) {
          totalCost
        }
      }
    `),
    dates.start && dates.end && selectedCabins.length
      ? {
          variables: {
            data: {
              startDate: dates.start.toISOString(),
              endDate: dates.end.toISOString(),
              cabins: selectedCabins.map((cabin) => ({ id: cabin.id })),
              participants: {
                internal: internalParticipants,
                external: externalParticipants,
              },
            },
          },
        }
      : skipToken
  );

  const totalCost = data?.totalCost.totalCost ?? Number.NaN;

  return (
    <Container maxWidth="sm" disableGutters>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader title="Kontaktinformasjon" />
          <CardContent>
            <Stack direction="column" spacing={2}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  {...register("firstName")}
                  label="Fornavn"
                  autoComplete="given-name"
                  required
                  fullWidth
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName?.message ?? " "}
                />
                <TextField
                  {...register("lastName")}
                  label="Etternavn"
                  autoComplete="family-name"
                  required
                  fullWidth
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName?.message ?? " "}
                />
              </Stack>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  {...register("email")}
                  label="E-post"
                  autoComplete="email"
                  type="email"
                  required
                  fullWidth
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message ?? " "}
                />
                <TextField
                  {...register("phone")}
                  label="Mobilnummer"
                  type="tel"
                  autoComplete="tel"
                  required
                  fullWidth
                  error={Boolean(errors.phone)}
                  helperText={errors.phone?.message ?? " "}
                />
              </Stack>
              <Grid container direction="row" spacing={2} alignItems="center">
                <Grid xs>
                  <Controller
                    name="internalParticipants"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.internalParticipants)} required>
                        <InputLabel id="internal-participants-label">Antall indøkere</InputLabel>
                        <Select
                          {...field}
                          labelId="internal-participants-label"
                          id="internal-participants"
                          label="Antall indøkere"
                        >
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
                </Grid>
                <Grid xs>
                  <Controller
                    name="externalParticipants"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.externalParticipants)} required>
                        <InputLabel id="external-participants-label">Antall eksterne</InputLabel>
                        <Select
                          {...field}
                          labelId="external-participants-label"
                          id="external-participants"
                          label="Antall eksterne"
                        >
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
                </Grid>
                <Grid md={6} xs={12}>
                  <Typography>Pris: {totalCost} NOK</Typography>
                  <FormHelperText> </FormHelperText>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
          <CardActions>
            <Stack direction="row" width="100%" justifyContent="flex-end" spacing={2}>
              <Button onClick={() => onPrevious()} startIcon={<KeyboardArrowLeft />}>
                Tilbake
              </Button>
              <Button type="submit" endIcon={<KeyboardArrowRight />}>
                Neste
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </form>
    </Container>
  );
}

function getBookingDetailsSchema(totalGuestsAllowed: number): yup.ObjectSchema<BookingDetailsFields> {
  return yup.object({
    firstName: yup.string().required().label("Fornavn"),
    lastName: yup.string().required().label("Etternavn"),
    email: yup.string().email().required().label("E-post"),
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

export { BookingDetails };
export type { BookingDetailsFields };
