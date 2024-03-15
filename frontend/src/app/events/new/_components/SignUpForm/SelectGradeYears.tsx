import { Chip, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import { sortBy } from "lodash";
import { Controller, FieldPath, useFormContext } from "react-hook-form";

import { SignUpFormType } from ".";

type Props = {
  name: Extract<FieldPath<SignUpFormType>, `slots.${number}.gradeYears` | "gradeYears">;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
  helperText?: React.ReactNode;
};

function SelectGradeYears({ name, disabled, fullWidth, size, helperText }: Props) {
  const { control } = useFormContext<SignUpFormType>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth={fullWidth} error={Boolean(error)} disabled={disabled} size={size}>
          <InputLabel id="select-category-label" shrink>
            Klassetrinn
          </InputLabel>
          <Select
            {...field}
            value={field.value ?? []}
            labelId="select-category-label"
            id="select-category"
            label="Klassetrinn"
            displayEmpty
            notched
            multiple
            renderValue={(selected) => {
              if (selected.length === 0 || selected.length === 5) {
                return "Alle";
              }
              return (
                <Stack direction="row" spacing={1}>
                  {sortBy(selected)
                    .map((val) => `${val}`)
                    .map((val) => (
                      <Chip
                        sx={{ width: "2rem" }}
                        size="small"
                        color={disabled ? "default" : "primary"}
                        key={val}
                        label={val}
                      />
                    ))}
                </Stack>
              );
            }}
          >
            {[1, 2, 3, 4, 5].map((gradeYear) => (
              <MenuItem key={gradeYear} value={gradeYear}>
                {gradeYear}. klasse
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={Boolean(error)}>{error?.message ?? helperText ?? " "}</FormHelperText>
        </FormControl>
      )}
    />
  );
}

export { SelectGradeYears };
