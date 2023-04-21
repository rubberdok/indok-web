import { BaseTextFieldProps, TextField } from "@mui/material";
import dayjs from "dayjs";
import { Control, Controller } from "react-hook-form";
import { FieldPathByValue } from "react-hook-form";

import { IEventForm } from "../schema";

interface Props extends BaseTextFieldProps {
  name: FieldPathByValue<IEventForm, Date>;
  control: Control<IEventForm>;
}

export const DateTimePicker: React.FC<Props> = ({ name, control, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          value={dayjs(field.value).format("YYYY-MM-DDTHH:mm")}
          error={Boolean(error)}
          helperText={error?.message}
          fullWidth
          required
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          {...props}
        />
      )}
    />
  );
};
