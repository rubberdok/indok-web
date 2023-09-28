import { PlaceOutlined } from "@mui/icons-material";
import { InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { IEventForm } from "../schema";

import { DateTimePicker } from "./DateTimePicker";

export const TimeAndPlace: React.FC = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<IEventForm>();

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="subtitle2">Tid</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <DateTimePicker name="timeAndPlace.start" control={control} label="Starttid" />
        <DateTimePicker name="timeAndPlace.end" control={control} label="Sluttid" />
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
