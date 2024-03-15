import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import { BasicEventFormType } from ".";

type Props = {
  categories: { id: string; name: string }[];
};

function SelectCategories({ categories }: Props) {
  const { control } = useFormContext<BasicEventFormType>();
  return (
    <Controller
      control={control}
      name="categories"
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={Boolean(error)}>
          <InputLabel id="select-category-label">Kategorier</InputLabel>
          <Select
            {...field}
            value={field.value ?? []}
            labelId="select-category-label"
            id="select-category"
            label="Kategorier"
            multiple
          >
            {categories?.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={Boolean(error)}>{error?.message ?? " "}</FormHelperText>
        </FormControl>
      )}
    />
  );
}

export { SelectCategories };
