import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { sortBy } from "lodash";
import { Controller, useFormContext } from "react-hook-form";

import { IEventForm } from "../schema";

type Props = {
  disabled?: boolean;
};

export const GradeYears: React.FC<Props> = ({ disabled }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<IEventForm>();

  return (
    <Controller
      control={control}
      name="info.gradeYears"
      render={({ field }) => (
        <FormControl sx={{ width: "100%" }} disabled={disabled} variant="filled">
          <InputLabel shrink htmlFor="select-grade-years">
            Klassetrinn
          </InputLabel>
          <Select
            variant="filled"
            multiple
            {...field}
            value={field.value ?? []}
            label="Klassetrinn"
            displayEmpty
            inputProps={{
              id: "select-grade-years",
            }}
            renderValue={(selected) => {
              if (selected.length === 0 || selected.length === 5) {
                return "Alle";
              }
              return sortBy(selected)
                .map((val) => `${val}. klasse`)
                .join(", ");
            }}
          >
            {[1, 2, 3, 4, 5].map((gradeYear) => (
              <MenuItem key={gradeYear} value={gradeYear}>
                {gradeYear}. klasse
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={Boolean(errors.info?.gradeYears)}>{errors.info?.gradeYears?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
};
