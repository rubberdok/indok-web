import { Link } from "@/app/components/Link";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import { FormControl, FormControlLabel, FormHelperText, Stack, Switch, TextField, Typography } from "@mui/material";
import { round } from "lodash";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { SelectMerchant } from "./SelectMerchant";

type Props = {
  merchants: FragmentType<typeof MerchantFragment>[];
};

const MerchantFragment = graphql(`
  fragment TicketEventForm_Merchant on Merchant {
    id
    name
    ...SelectMerchant_Merchant
  }
`);

const ticketEventFormSchema = z.object({
  price: z.number().positive(),
  merchantId: z.string().uuid(),
});

const fee = 0.0175;

type TicketEventFormType = z.infer<typeof ticketEventFormSchema>;

function TicketEventForm(props: Props) {
  const merchants = getFragmentData(MerchantFragment, props.merchants);
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<TicketEventFormType>();

  return (
    <>
      <Stack direction="column" spacing={4}>
        <Typography gutterBottom variant="body2">
          For å ha et arrangement med betaling må du velge hvilken salgsenhet hos Vipps som skal motta utbetalingene.
          Dersom du ikke finner en salgsenhet som passer i listen nedenfor kan du ta kontakt med Rubberdøk på{" "}
          <Link href="mailto:kontakt@rubberdok.no">kontakt@rubberdok.no</Link> for å få lagt til en ny salgsenhet.
        </Typography>
        <Stack direction="row" spacing={2}>
          <SelectMerchant fullWidth merchants={merchants} />
          <TextField
            fullWidth
            label="Pris"
            required
            {...register("price")}
            error={Boolean(errors.price)}
            InputProps={{
              endAdornment: "NOK",
            }}
            helperText={errors.price?.message}
          />
        </Stack>
        <FormControl>
          <FormControlLabel
            control={<Switch />}
            labelPlacement="start"
            label={`Inkluder Vipps-avgiften i prisen (${round(fee * 100, 2)} %)`}
            onChange={(_e, checked) => {
              if (checked) {
                const prevPrice = getValues("price");
                const newPrice = Math.ceil(prevPrice / (1 - fee));
                setValue("price", newPrice);
              } else {
                const prevPrice = getValues("price");
                const newPrice = Math.floor(prevPrice * (1 - fee));
                setValue("price", newPrice);
              }
            }}
          />
          <FormHelperText>
            Betalinger med Vipps medfører en avgift på 3 % av beløpet. Dersom du ønsker så kan du justere prisen til å
            ta høyde for denne avgiften.
          </FormHelperText>
        </FormControl>
      </Stack>
    </>
  );
}
export { TicketEventForm, ticketEventFormSchema };
export type { TicketEventFormType };
