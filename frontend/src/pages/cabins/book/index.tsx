import { useQuery } from "@apollo/client";
import Navbar from "@components/navbar/Navbar";
import CabinAvailability from "@components/pages/cabins/CabinAvailability";
import CabinDatePicker from "@components/pages/cabins/CabinDatePicker";
import { QUERY_CABINS } from "@graphql/cabins/queries";
import { Cabin } from "@interfaces/cabins";
import { Box, Grid, Step, StepLabel, Stepper, Button, Typography, Paper } from "@material-ui/core";
import { NextPage } from "next";
import React, { useState } from "react";

const steps = ["Velg hytte", "Innsjekk/Utsjekk", "Kontaktinfo", "Betaling", "Kvittering"];

const CabinBookingPage: NextPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Velg Hytte
  const [chosenCabins, setChosenCabins] = useState<Cabin[]>([]);

  const cabinQuery = useQuery<{ cabins: Cabin[] }>(QUERY_CABINS);

  const getStepComponent = () => {
    switch (activeStep) {
      case 0:
        // Velg hytte
        console.log("Velg Hytte");
        return cabinQuery.data ? (
          <CabinAvailability
            allCabins={cabinQuery.data.cabins}
            chosenCabins={chosenCabins}
            setChosenCabins={setChosenCabins}
          />
        ) : null;
      case 1:
        // Velg innsjekk
        return <CabinDatePicker />;
      case 2:
        // Velg Kontaktinfo
        return <Typography variant="h3">Kontaktinfo placeholder</Typography>;
      case 3:
        // Betaling
        return <Typography variant="h3">Betaling placeholder</Typography>;
      case 4:
        // Kvittering
        return <Typography variant="h3">Kvittering placeholder</Typography>;
      default:
        <Typography>Step not found</Typography>;
    }
  };

  return (
    <>
      <Navbar />
      <Box m={10}>
        <Grid container direction="column" alignItems="stretch">
          <Grid item>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
          <Grid item>
            <Box m={2}>
              <Paper>
                <Box m={2}>{getStepComponent()}</Box>
              </Paper>
            </Box>
          </Grid>
          <Grid item container justify="space-between">
            <Button variant="contained" disabled={activeStep === 0} onClick={() => setActiveStep((prev) => prev - 1)}>
              Forrige
            </Button>
            <Button
              variant="contained"
              disabled={activeStep === steps.length - 1}
              onClick={() => setActiveStep((prev) => prev + 1)}
            >
              Neste
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CabinBookingPage;
