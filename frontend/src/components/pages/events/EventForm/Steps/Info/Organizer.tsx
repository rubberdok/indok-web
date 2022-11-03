import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import { IEventForm } from "../../schema";
import { Organization } from "../../types";

type Props = {
  organizations: Organization[];
  disabled?: boolean;
};

export const Organizer: React.FC<Props> = ({ organizations, disabled }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<IEventForm>();

  return (
    <Controller
      control={control}
      name="info.organizer"
      render={({ field }) => (
        <FormControl disabled={disabled} variant="filled" fullWidth required error={Boolean(errors.info?.organizer)}>
          <InputLabel htmlFor="select-organizer">Arrangør</InputLabel>
          <Select {...field}>
            <MenuItem value="">
              <em>Ingen organisasjon</em>
            </MenuItem>
            {organizations.map((organization) => (
              <MenuItem key={organization.id} value={organization.id}>
                {organization.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={Boolean(errors.info?.organizer)}>{errors.info?.organizer?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
};
