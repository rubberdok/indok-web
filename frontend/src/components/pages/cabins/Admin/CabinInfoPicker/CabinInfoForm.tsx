import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Unstable_Grid2 as Grid, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import * as yup from "@/lib/validation";

export type CabinInfoForm = {
  oksen?: {
    internalPrice: number;
    internalPriceWeekend: number;
    externalPrice: number;
    externalPriceWeekend: number;
    maxGuests: number;
  };
  bjornen?: {
    internalPrice: number;
    internalPriceWeekend: number;
    externalPrice: number;
    externalPriceWeekend: number;
    maxGuests: number;
  };
};

const validationSchema: yup.ObjectSchema<CabinInfoForm> = yup.object({
  oksen: yup.object({
    internalPrice: yup.number().positive().required().label("Internpris"),
    externalPrice: yup.number().positive().required().label("Eksternpris"),
    maxGuests: yup.number().positive().required().label("Kapasitet (antall gjester)"),
  }),
  bjornen: yup.object({
    internalPrice: yup.number().positive().required().label("Internpris"),
    externalPrice: yup.number().positive().required().label("Eksternpris"),
    maxGuests: yup.number().positive().required().label("Kapasitet (antall gjester)"),
  }),
});

type Props = {
  defaultValues: CabinInfoForm;
  onSubmit: (data: CabinInfoForm) => void;
  values?: CabinInfoForm;
};

export const CabinInfoForm: React.FC<Props> = ({ defaultValues, values, onSubmit }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CabinInfoForm>({
    resolver: yupResolver(validationSchema),
    mode: "onTouched",
    defaultValues,
    values,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container direction="column" spacing={2}>
        <Grid container direction={{ xs: "column", md: "row" }} justifyContent="space-between">
          <Grid container direction="column" xs={12} md={5}>
            <Grid>
              <Typography variant="subtitle1" component="h3">
                Bjørnen
              </Typography>
            </Grid>
            <Grid>
              <TextField
                {...register("bjornen.internalPrice")}
                required
                helperText={errors.bjornen?.internalPrice?.message}
                error={Boolean(errors.bjornen?.internalPrice)}
                type="number"
                fullWidth
                label="Internpris"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid>
              <TextField
                {...register("bjornen.internalPriceWeekend")}
                required
                helperText={errors.bjornen?.internalPriceWeekend?.message}
                error={Boolean(errors.bjornen?.internalPriceWeekend)}
                type="number"
                fullWidth
                label="Internpris i helg"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid>
              <TextField
                {...register("bjornen.externalPrice")}
                required
                helperText={errors.bjornen?.externalPrice?.message}
                error={Boolean(errors.bjornen?.externalPrice)}
                type="number"
                fullWidth
                label="Eksternpris"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid>
              <TextField
                {...register("bjornen.externalPriceWeekend")}
                required
                helperText={errors.bjornen?.externalPriceWeekend?.message}
                error={Boolean(errors.bjornen?.externalPriceWeekend)}
                type="number"
                fullWidth
                label="Eksternpris i helg"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid>
              <TextField
                {...register("bjornen.maxGuests")}
                required
                helperText={errors.bjornen?.maxGuests?.message}
                error={Boolean(errors.bjornen?.maxGuests)}
                type="number"
                fullWidth
                label="Kapasitet (antall gjester)"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid container direction="column" xs={12} md={5}>
            <Grid>
              <Typography variant="subtitle1" component="h3">
                Oksen
              </Typography>
            </Grid>
            <Grid>
              <TextField
                {...register("oksen.internalPrice")}
                required
                helperText={errors.oksen?.internalPrice?.message}
                error={Boolean(errors.oksen?.internalPrice)}
                type="number"
                fullWidth
                label="Internpris"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid>
              <TextField
                {...register("oksen.internalPriceWeekend")}
                required
                helperText={errors.oksen?.internalPriceWeekend?.message}
                error={Boolean(errors.oksen?.internalPriceWeekend)}
                type="number"
                fullWidth
                label="Internpris i helg"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid>
              <TextField
                {...register("oksen.externalPrice")}
                required
                helperText={errors.oksen?.externalPrice?.message}
                error={Boolean(errors.oksen?.externalPrice)}
                type="number"
                fullWidth
                label="Eksternpris"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid>
              <TextField
                {...register("oksen.externalPriceWeekend")}
                required
                helperText={errors.oksen?.externalPriceWeekend?.message}
                error={Boolean(errors.oksen?.externalPriceWeekend)}
                type="number"
                fullWidth
                label="Eksternpris i helg"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid>
              <TextField
                {...register("oksen.maxGuests")}
                required
                helperText={errors.oksen?.maxGuests?.message}
                error={Boolean(errors.oksen?.maxGuests)}
                type="number"
                fullWidth
                label="Kapasitet (antall gjester)"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="row" justifyContent="flex-end">
          <Grid>
            <Button variant="contained" type="submit">
              Lagre
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
