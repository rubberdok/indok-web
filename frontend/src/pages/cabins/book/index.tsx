import { useQuery } from "@apollo/client";
import Navbar from "@components/navbar/Navbar";
import CabinAvailability from "@components/pages/cabins/CabinAvailability";
import CabinDatePicker from "@components/pages/cabins/CabinDatePicker";
import { QUERY_CABINS } from "@graphql/cabins/queries";
import { Cabin } from "@interfaces/cabins";
import { Box, Grid, Step, StepLabel, Stepper, Button, Typography, Paper, Tooltip } from "@material-ui/core";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";

interface StepReady {
  [step: number]: { ready: boolean; stepName: string; errortext: string };
}

const steps = ["Velg hytte", "Innsjekk/Utsjekk", "Kontaktinfo", "Betaling", "Kvittering"];

const initalStepReady: StepReady = steps.reduce((initialObject, step, index) => {
  initialObject[index] = {
    stepName: step,
    ready: false,
    errortext: "",
  };
  return initialObject;
}, {} as StepReady);

const CabinBookingPage: NextPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepReady, setStepReady] = useState<StepReady>(initalStepReady);

  // Velg Hytte
  const [chosenCabins, setChosenCabins] = useState<Cabin[]>([]);
  const cabinQuery = useQuery<{ cabins: Cabin[] }>(QUERY_CABINS);
  useEffect(() => {
    // Cannot go to next step if no cabin is chosen
    setStepReady({
      ...stepReady,
      0: { ...stepReady[0], ready: chosenCabins.length > 0, errortext: "Du må velge en hytte for å gå videre" },
    });
  }, [chosenCabins]);

  const getStepComponent = () => {
    switch (activeStep) {
      case 0:
        // Velg hytte
        return cabinQuery.data ? (
          <CabinAvailability
            allCabins={cabinQuery.data.cabins}
            chosenCabins={chosenCabins}
            setChosenCabins={setChosenCabins}
          />
        ) : null;
      case 1:
        // Velg innsjekk
        return <CabinDatePicker chosenCabins={chosenCabins} />;
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
        <Grid container direction="column" justify="center" spacing={1}>
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
            <Paper>
              <Box p={10}>{getStepComponent()}</Box>
            </Paper>
          </Grid>
          <Grid item container justify="space-between">
            <Button variant="contained" disabled={activeStep === 0} onClick={() => setActiveStep((prev) => prev - 1)}>
              Forrige
            </Button>
            <Tooltip
              title={stepReady[activeStep].errortext}
              placement="left"
              disableHoverListener={stepReady[activeStep].ready}
            >
              <Box>
                <Button
                  variant="contained"
                  disabled={!stepReady[activeStep].ready}
                  onClick={() => setActiveStep((prev) => prev + 1)}
                >
                  Neste
                </Button>
              </Box>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CabinBookingPage;
