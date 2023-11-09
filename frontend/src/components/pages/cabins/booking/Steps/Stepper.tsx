import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Box, Button, MobileStepper, Stack } from "@mui/material";
import { useContext } from "react";

import { StepContext } from "../StepContext";

export function Stepper(props: { nextButton?: React.ReactNode; backButton?: React.ReactNode }): JSX.Element {
  const { steps, activeStep, nextStep, previousStep } = useContext(StepContext);

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps - 1;

  const defaultNextButtton = (
    <Button
      variant="contained"
      endIcon={<KeyboardArrowRight />}
      onClick={() => nextStep()}
      sx={{ visibility: isLastStep ? "hidden" : "visible" }}
    >
      Neste
    </Button>
  );
  const defaultBackButton = (
    <Button
      variant="contained"
      startIcon={<KeyboardArrowLeft />}
      onClick={() => previousStep()}
      sx={{ visibility: isFirstStep ? "hidden" : "visible" }}
    >
      Tilbake
    </Button>
  );

  const { nextButton = defaultNextButtton, backButton = defaultBackButton } = props;
  return (
    <>
      <MobileStepper
        nextButton={nextButton}
        backButton={backButton}
        steps={steps}
        activeStep={activeStep}
        position="bottom"
        variant="text"
        sx={{
          display: { md: "none" },
        }}
      />
      <Box
        display={{
          xs: "none",
          md: "block",
        }}
      >
        <Stack direction="row" justifyContent="flex-end" spacing={4}>
          {backButton}
          {nextButton}
        </Stack>
      </Box>
    </>
  );
}
