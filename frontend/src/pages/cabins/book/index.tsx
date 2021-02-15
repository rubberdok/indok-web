import Navbar from "@components/navbar/Navbar";
import CabinAvailability from "@components/pages/cabins/CabinAvailability";
import CabinDatePicker from "@components/pages/cabins/CabinDatePicker";
import { Box, Grid, Step, StepLabel, Stepper, Button, Typography } from "@material-ui/core";
import { NextPage } from "next";
import { useState } from "react";
const steps = ["Velg hytte", "Velg innsjekk", "Velg utsjekk", "Betaling", "Kvittering"];

const CabinBookingPage: NextPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  const getStepComponent = () => {
    switch (activeStep) {
      case 0:
        // Velg hytte
        return <CabinAvailability />;
      case 1:
        // Velg innsjekk
        return <CabinDatePicker />;
      case 2:
        // Velg utsjekk
        return <CabinDatePicker />;
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
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Box m={2}>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Grid>
        <Grid item>
          <Box m={2}>{getStepComponent()}</Box>
        </Grid>
        <Grid item container justify="space-around">
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
    </>
  );
};

export default CabinBookingPage;
