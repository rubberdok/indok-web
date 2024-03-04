import { FormControl, FormHelperText, InputLabel, Select } from "@mui/material";
import { notFound } from "next/navigation";
import { Controller, useFormContext } from "react-hook-form";
import { BasicEventFormType } from ".";

type Props = {
  organizations: { id: string; name: string }[];
};

function SelectOrganization({ organizations }: Props) {
  if (!organizations.length) return notFound();

  const { control } = useFormContext<BasicEventFormType>();
  return (
    <Controller
      control={control}
      name="organizationId"
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={Boolean(error)} required>
          <InputLabel id="select-organization-label">Velg forening</InputLabel>
          <Select {...field} labelId="select-organization-label" id="select-organization" label="Velg forening" native>
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
              </option>
            ))}
          </Select>
          <FormHelperText error={Boolean(error)}>{error?.message ?? " "}</FormHelperText>
        </FormControl>
      )}
    />
  );
}

export { SelectOrganization };
