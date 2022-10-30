import { CalendarMonthRounded, PlaceOutlined } from "@mui/icons-material";
import { InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { IEventForm } from "./schema";

export const TimeAndPlace: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<IEventForm>();

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="subtitle2">Tid</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          {...register("timeAndPlace.start")}
          error={Boolean(errors.timeAndPlace?.start)}
          helperText={errors.timeAndPlace?.start?.message}
          fullWidth
          required
          type="datetime-local"
          label="Starttid"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CalendarMonthRounded />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          {...register("timeAndPlace.end")}
          error={Boolean(errors.timeAndPlace?.end)}
          helperText={errors.timeAndPlace?.end?.message}
          fullWidth
          required
          type="datetime-local"
          label="Sluttid"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CalendarMonthRounded />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Typography variant="subtitle2">Sted</Typography>
      <TextField
        {...register("timeAndPlace.location")}
        error={Boolean(errors.timeAndPlace?.location)}
        helperText={errors.timeAndPlace?.location?.message}
        fullWidth
        label="Sted"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <PlaceOutlined />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
};
