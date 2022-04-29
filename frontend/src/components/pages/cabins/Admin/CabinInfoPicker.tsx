import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_CABIN } from "@graphql/cabins/mutations";
import { QUERY_CABINS } from "@graphql/cabins/queries";
import { Cabin } from "@interfaces/cabins";
import { Button, Grid, Snackbar, TextField, Typography } from "@mui/material";
import { Alert } from "@mui/material";
import { cabinInfoValidationSchema } from "@utils/cabins";
import { useFormik } from "formik";
import { useEffect, useState } from "react";

type FormikCabinValues = {
  oksenInternalPrice?: number;
  bjornenInternalPrice?: number;
  oksenExternalPrice?: number;
  bjornenExternalPrice?: number;
  oksenMaxGuests?: number;
  bjornenMaxGuests?: number;
};

const getCabinData = (cabin?: Partial<Cabin>) => {
  return {
    name: cabin?.name,
    maxGuests: cabin?.maxGuests,
    internalPrice: cabin?.internalPrice,
    externalPrice: cabin?.externalPrice,
  };
};

/** Component for editing cabin information. Only used on the admin page. */
const CabinInfoPicker: React.VFC = () => {
  const cabinQuery = useQuery<{ cabins: Cabin[] }>(QUERY_CABINS);
  const [updateCabin] = useMutation<{ cabinData: Cabin }>(UPDATE_CABIN, {
    onError: () => {
      setAlertSeverity("error");
      setSnackbarMessage("En feilmelding oppstod.");
      setOpenSnackbar(true);
    },
    onCompleted: () => {
      setAlertSeverity("success");
      setSnackbarMessage("Oppdaterte info om hyttene.");
      setOpenSnackbar(true);
    },
    errorPolicy: "none",
  });

  const cabins = cabinQuery?.data?.cabins;
  const [bjornen, setBjornen] = useState<Cabin>();
  const [oksen, setOksen] = useState<Cabin>();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    if (cabins) {
      setBjornen(cabins?.find((cabin) => cabin.name == "Bjørnen"));
      setOksen(cabins?.find((cabin) => cabin.name == "Oksen"));
    }
  }, [cabins]);

  const handleUpdate = (values: FormikCabinValues) => {
    const oksenData: Partial<Cabin> = {
      name: "Oksen",
      internalPrice: values.oksenInternalPrice,
      externalPrice: values.oksenExternalPrice,
      maxGuests: values.oksenMaxGuests,
    };
    const bjornenData: Partial<Cabin> = {
      name: "Bjørnen",
      internalPrice: values.bjornenInternalPrice,
      externalPrice: values.bjornenExternalPrice,
      maxGuests: values.bjornenMaxGuests,
    };

    updateCabin({ variables: { cabinData: getCabinData(oksenData) } });
    updateCabin({ variables: { cabinData: getCabinData(bjornenData) } });
  };

  const formik = useFormik({
    initialValues: {
      oksenInternalPrice: oksen ? oksen.internalPrice : 0,
      oksenExternalPrice: oksen ? oksen.externalPrice : 0,
      oksenMaxGuests: oksen ? oksen.maxGuests : 0,
      bjornenInternalPrice: bjornen ? bjornen.internalPrice : 0,
      bjornenExternalPrice: bjornen ? bjornen.externalPrice : 0,
      bjornenMaxGuests: bjornen ? bjornen.maxGuests : 0,
    },
    onSubmit: (values) => handleUpdate(values),
    validationSchema: cabinInfoValidationSchema,
    enableReinitialize: true,
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container direction="row" spacing={10}>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
            <Alert severity={alertSeverity}>{snackbarMessage}</Alert>
          </Snackbar>
          <Grid item container direction="column" xs={6}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5">Bjørnen</Typography>
              <TextField
                label="Internpris"
                name="bjornenInternalPrice"
                variant="outlined"
                margin="normal"
                required
                value={formik.values.bjornenInternalPrice}
                onChange={formik.handleChange}
                onBlur={() => formik.setFieldTouched("bjornenInternalPrice")}
                error={formik.touched.bjornenInternalPrice && Boolean(formik.errors.bjornenInternalPrice)}
                helperText={formik.touched.bjornenInternalPrice && formik.errors.bjornenInternalPrice}
                InputLabelProps={{
                  shrink: formik.values.bjornenInternalPrice !== undefined,
                }}
              />
              <TextField
                label="Eksternpris"
                name="bjornenExternalPrice"
                variant="outlined"
                margin="normal"
                required
                value={formik.values.bjornenExternalPrice}
                onChange={formik.handleChange}
                onBlur={() => formik.setFieldTouched("bjornenExternalPrice")}
                error={formik.touched.bjornenExternalPrice && Boolean(formik.errors.bjornenExternalPrice)}
                helperText={formik.touched.bjornenExternalPrice && formik.errors.bjornenExternalPrice}
                InputLabelProps={{
                  shrink: formik.values.bjornenExternalPrice !== undefined,
                }}
              />
              <TextField
                label="Kapasitet (antall gjester)"
                name="bjornenMaxGuests"
                variant="outlined"
                margin="normal"
                required
                value={formik.values.bjornenMaxGuests}
                onChange={formik.handleChange}
                onBlur={() => formik.setFieldTouched("bjornenMaxGuests")}
                error={formik.touched.bjornenMaxGuests && Boolean(formik.errors.bjornenMaxGuests)}
                helperText={formik.touched.bjornenMaxGuests && formik.errors.bjornenMaxGuests}
                InputLabelProps={{
                  shrink: formik.values.bjornenMaxGuests !== undefined,
                }}
              />
            </Grid>
          </Grid>
          <Grid item container direction="column" xs={6}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5">Oksen</Typography>
              <TextField
                label="Internpris"
                name="oksenInternalPrice"
                variant="outlined"
                margin="normal"
                required
                value={formik.values.oksenInternalPrice}
                onChange={formik.handleChange}
                onBlur={() => formik.setFieldTouched("oksenInternalPrice")}
                error={formik.touched.oksenInternalPrice && Boolean(formik.errors.oksenInternalPrice)}
                helperText={formik.touched.oksenInternalPrice && formik.errors.oksenInternalPrice}
                InputLabelProps={{
                  shrink: formik.values.oksenInternalPrice !== undefined,
                }}
              />
              <TextField
                label="Eksternpris"
                name="oksenExternalPrice"
                variant="outlined"
                margin="normal"
                required
                value={formik.values.oksenExternalPrice}
                onChange={formik.handleChange}
                onBlur={() => formik.setFieldTouched("oksenExternalPrice")}
                error={formik.touched.oksenExternalPrice && Boolean(formik.errors.oksenExternalPrice)}
                helperText={formik.touched.oksenExternalPrice && formik.errors.oksenExternalPrice}
                InputLabelProps={{
                  shrink: formik.values.oksenExternalPrice !== undefined,
                }}
              />
              <TextField
                label="Kapasitet (antall gjester)"
                name="oksenMaxGuests"
                variant="outlined"
                margin="normal"
                required
                value={formik.values.oksenMaxGuests}
                onChange={formik.handleChange}
                onBlur={() => formik.setFieldTouched("oksenMaxGuests")}
                error={formik.touched.oksenMaxGuests && Boolean(formik.errors.oksenMaxGuests)}
                helperText={formik.touched.oksenMaxGuests && formik.errors.oksenMaxGuests}
                InputLabelProps={{
                  shrink: formik.values.oksenMaxGuests !== undefined,
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained">
              Lagre
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default CabinInfoPicker;
