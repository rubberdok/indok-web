import { FormControl, FormHelperText, InputLabel, Select } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import { TicketEventFormType } from ".";

type Props = {
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
  helperText?: React.ReactNode;
  merchants: readonly FragmentType<typeof MerchantFragment>[];
};

const MerchantFragment = graphql(`
  fragment SelectMerchant_Merchant on Merchant {
    id
    name
  }
`);

function SelectMerchant({ disabled, fullWidth, size, helperText, ...props }: Props) {
  const { control } = useFormContext<TicketEventFormType>();
  const merchants = getFragmentData(MerchantFragment, props.merchants);

  return (
    <Controller
      control={control}
      name="merchantId"
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth={fullWidth} error={Boolean(error)} disabled={disabled} size={size}>
          <InputLabel id="select-merchant-label" shrink>
            Salgsenhet (Vipps)
          </InputLabel>
          <Select
            {...field}
            value={field.value ?? []}
            labelId="select-merchant-label"
            id="select-merchant"
            label="Salgsenhet (Vipps)"
            displayEmpty
            notched
            native
          >
            <option value={undefined}></option>
            {merchants.map(({ id, name }) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </Select>
          <FormHelperText error={Boolean(error)}>{error?.message ?? helperText}</FormHelperText>
        </FormControl>
      )}
    />
  );
}

export { SelectMerchant };
