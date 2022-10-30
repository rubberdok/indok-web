import { useQuery } from "@apollo/client";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import { AllCategoriesDocument } from "@/generated/graphql";

import { EventForm } from "../schema";

type Props = {
  disabled?: boolean;
};

export const Category: React.FC<Props> = ({ disabled }) => {
  const { data, loading, error } = useQuery(AllCategoriesDocument);

  const {
    control,
    formState: { errors },
  } = useFormContext<EventForm>();

  return (
    <Controller
      control={control}
      name="info.category"
      render={({ field }) => (
        <FormControl
          variant="filled"
          disabled={disabled || loading || Boolean(error)}
          fullWidth
          error={Boolean(error || errors.info?.category)}
        >
          <InputLabel htmlFor="select-category">Kategori</InputLabel>
          <Select {...field}>
            <MenuItem value={""}>
              <em>Ingen kategori</em>
            </MenuItem>
            {data?.allCategories?.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
            {!data?.allCategories && <MenuItem>Laster...</MenuItem>}
          </Select>
          <FormHelperText error={Boolean(error || errors.info?.category)}>
            {error ? "Kunne ikke laste kategorier" : errors.info?.category?.message}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};
