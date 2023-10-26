import { PeopleOutlineRounded } from "@mui/icons-material";
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Unstable_Grid2 as Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import { IEventForm } from "../schema";

import { DateTimePicker } from "./DateTimePicker";

export const Registration: React.FC = () => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<IEventForm>();

  const disabled = watch("registration.variant") === "closed";

  return (
    <Stack direction="column" spacing={2}>
      <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start">
        <Grid xs={12} md={6}>
          <Controller
            name="registration.variant"
            control={control}
            render={({ field }) => (
              <FormControl variant="filled" fullWidth error={Boolean(errors.registration?.variant)} required>
                <InputLabel id="select-registration-label">Påmeldingstype</InputLabel>
                <Select {...field} labelId="select-registration-label" id="select-registration">
                  <MenuItem value="closed">Ingen påmelding</MenuItem>
                  <MenuItem value="open">Påmelding</MenuItem>
                  <MenuItem value="binding">Bindende påmelding</MenuItem>
                </Select>
                <FormHelperText error={Boolean(errors.registration?.variant)}>
                  {errors.registration?.variant?.message}
                </FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
      <Divider />
      <Typography variant="subtitle2">Tider for påmelding</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <DateTimePicker
          name="registration.details.signUpOpen"
          control={control}
          label="Påmelding åpner"
          disabled={disabled}
        />
        <DateTimePicker
          name="registration.details.deadline"
          control={control}
          label="Påmelding stenger"
          disabled={disabled}
        />
      </Stack>
      <Typography variant="subtitle2">Plasser</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          fullWidth
          label="Antall plasser"
          {...register("registration.details.availableSeats")}
          type="number"
          disabled={disabled}
          error={Boolean(errors.registration?.details?.availableSeats)}
          helperText={errors.registration?.details?.availableSeats?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PeopleOutlineRounded />
              </InputAdornment>
            ),
          }}
        />
        <FormControl fullWidth disabled={disabled}>
          <Controller
            name="registration.details.requiresExtraInformation"
            control={control}
            render={({ field }) => (
              <>
                <FormControlLabel label="Ekstra informasjon" control={<Checkbox {...field} checked={field.value} />} />
                <FormHelperText error={Boolean(errors.registration?.details?.requiresExtraInformation)}>
                  {errors.registration?.details?.requiresExtraInformation?.message ||
                    "Be om utfylling av ekstra informasjon ved påmelding"}
                </FormHelperText>
              </>
            )}
          />
        </FormControl>
      </Stack>
    </Stack>
  );
};
