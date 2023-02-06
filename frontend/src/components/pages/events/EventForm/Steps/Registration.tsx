import { CalendarMonthRounded, PeopleOutlineRounded } from "@mui/icons-material";
import { Divider, FormControlLabel, InputAdornment, Stack, Switch, TextField, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import { IEventForm } from "../schema";

export const Registration: React.FC = () => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<IEventForm>();

  const disabled = !watch("registration.isAttendable");

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start">
        <Controller
          name="registration.isAttendable"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
              label={<Typography variant="subtitle2">Påmelding</Typography>}
              labelPlacement="start"
              sx={{ ml: 0 }}
            />
          )}
        />
        <Controller
          name="registration.details.binding"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              disabled={disabled}
              control={<Switch {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
              label="Bindende påmelding"
              labelPlacement="start"
              sx={{ ml: 0 }}
            />
          )}
        />
      </Stack>
      <Divider />
      <Typography variant="subtitle2">Tider for påmelding</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          {...register("registration.details.signUpOpen")}
          error={Boolean(errors.registration?.details?.signUpOpen)}
          helperText={errors.registration?.details?.signUpOpen?.message}
          fullWidth
          required
          disabled={disabled}
          type="datetime-local"
          label="Påmelding åpner"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          {...register("registration.details.deadline")}
          error={Boolean(errors.registration?.details?.deadline)}
          helperText={errors.registration?.details?.deadline?.message}
          fullWidth
          required
          disabled={disabled}
          type="datetime-local"
          label="Påmelding stenger"
          InputLabelProps={{ shrink: true }}
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
      </Stack>
    </Stack>
  );
};
