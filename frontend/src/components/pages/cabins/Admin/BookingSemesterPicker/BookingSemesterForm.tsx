import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormControlLabel, Unstable_Grid2 as Grid, Switch, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

export type BookingForm = {
  fall: {
    active: boolean;
    start: string;
    end: string;
  };
  spring: {
    active: boolean;
    start: string;
    end: string;
  };
};

type ValidationSchema = {
  fall: {
    start: Date;
    end: Date;
    active: boolean;
  };
  spring: {
    start: Date;
    end: Date;
    active: boolean;
  };
};

const validationSchema: yup.ObjectSchema<ValidationSchema> = yup.object({
  fall: yup
    .object({
      start: yup.date().required(),
      end: yup.date().required().min(yup.ref("start"), "Sluttdato må være etter startdato"),
      active: yup.boolean().required(),
    })
    .required(),
  spring: yup
    .object({
      start: yup.date().required(),
      end: yup.date().required().min(yup.ref("start"), "Sluttdato må være etter startdato"),
      active: yup.boolean().required(),
    })
    .required(),
});

type Props = {
  defaultValues: BookingForm;
  onSubmit: (data: BookingForm) => void;
  values?: BookingForm;
};

export const BookingSemesterForm: React.FC<Props> = ({ defaultValues, values, onSubmit }) => {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<BookingForm>({
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
                Høstsemester
              </Typography>
            </Grid>
            <Grid>
              <TextField
                {...register("fall.start")}
                required
                helperText={errors.fall?.start?.message}
                error={Boolean(errors.fall?.start)}
                type="date"
                fullWidth
                label="Start"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid>
              <TextField
                {...register("fall.end")}
                required
                helperText={errors.fall?.end?.message}
                error={Boolean(errors.fall?.end)}
                type="date"
                fullWidth
                label="Slutt"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid container>
              <FormControlLabel
                label="Åpent for bestillinger"
                control={
                  <Controller
                    name="fall.active"
                    control={control}
                    render={({ field }) => <Switch {...field} checked={field.value} />}
                  />
                }
                labelPlacement="start"
              />
            </Grid>
          </Grid>
          <Grid container direction="column" spacing={2} xs={12} md={5}>
            <Grid>
              <Typography variant="subtitle1" component="h3">
                Vårsemester
              </Typography>
            </Grid>

            <Grid>
              <TextField
                {...register("spring.start")}
                required
                helperText={errors.spring?.start?.message}
                error={Boolean(errors.spring?.start)}
                type="date"
                fullWidth
                label="Start"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid>
              <TextField
                {...register("spring.end")}
                required
                helperText={errors.spring?.end?.message}
                error={Boolean(errors.spring?.end)}
                type="date"
                fullWidth
                label="Slutt"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid>
              <FormControlLabel
                label="Åpent for bestillinger"
                control={
                  <Controller
                    name="spring.active"
                    control={control}
                    render={({ field }) => <Switch {...field} checked={field.value} />}
                  />
                }
                labelPlacement="start"
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
