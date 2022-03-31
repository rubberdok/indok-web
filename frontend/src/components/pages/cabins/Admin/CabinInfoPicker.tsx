import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_CABIN } from "@graphql/cabins/mutations";
import { QUERY_CABINS } from "@graphql/cabins/queries";
import { Cabin } from "@interfaces/cabins";
import { Button, Grid, Snackbar, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import CabinInfoInput from "./CabinInfoInput";

const getCabinData = (cabin?: Cabin) => {
  return {
    name: cabin?.name,
    maxGuests: cabin?.maxGuests,
    internalPrice: cabin?.internalPrice,
    externalPrice: cabin?.externalPrice,
  };
};

const CabinInfoPicker = () => {
  const cabinQuery = useQuery<{ cabins: Cabin[] }>(QUERY_CABINS);
  const [updateCabin] = useMutation<{ cabinData: Cabin }>(UPDATE_CABIN, {
    onError: ({ extraInfo, message }) => {
      console.log(extraInfo, message);
      setAlertSeverity("error");
      setSnackbarMessage("En feilmelding oppstod.");
      setOpenSnackbar(true);
    },
    onCompleted: () => {
      setAlertSeverity("success");
      setSnackbarMessage("Oppdaterte info om hyttene.eferfer");
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

  const handleCabinOnChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, cabin?: Cabin) => {
    if (cabin) {
      const field = e.currentTarget.name;
      if (cabin.name == "Oksen") {
        setOksen({ ...cabin, [field]: e.currentTarget.value });
      } else if (cabin.name == "Bjørnen") {
        setBjornen({ ...cabin, [field]: e.currentTarget.value });
      }
    }
  };

  const handleUpdate = () => {
    updateCabin({ variables: { cabinData: getCabinData(oksen) } });
    updateCabin({ variables: { cabinData: getCabinData(bjornen) } });
  };

  return (
    <>
      <Grid container direction="row" spacing={10}>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity={alertSeverity}>{snackbarMessage}</Alert>
        </Snackbar>
        <Grid item container direction="column" xs={6}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5">Bjørnen</Typography>
            <CabinInfoInput
              name="internalPrice"
              value={bjornen?.internalPrice}
              handleOnChange={(e) => handleCabinOnChange(e, bjornen)}
              cabin={bjornen}
            />
            <CabinInfoInput
              name="externalPrice"
              value={bjornen?.externalPrice}
              handleOnChange={(e) => handleCabinOnChange(e, bjornen)}
              cabin={bjornen}
            />
            <CabinInfoInput
              name="maxGuests"
              value={bjornen?.maxGuests}
              handleOnChange={(e) => handleCabinOnChange(e, bjornen)}
              cabin={bjornen}
            />
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={6}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5">Oksen</Typography>
            <CabinInfoInput
              name="internalPrice"
              value={oksen?.internalPrice}
              handleOnChange={(e) => handleCabinOnChange(e, oksen)}
              cabin={oksen}
            />
            <CabinInfoInput
              name="externalPrice"
              value={oksen?.externalPrice}
              handleOnChange={(e) => handleCabinOnChange(e, oksen)}
              cabin={oksen}
            />
            <CabinInfoInput
              name="maxGuests"
              value={oksen?.maxGuests}
              handleOnChange={(e) => handleCabinOnChange(e, oksen)}
              cabin={oksen}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Button onClick={handleUpdate} variant="contained">
            Lagre
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default CabinInfoPicker;
