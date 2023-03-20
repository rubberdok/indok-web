import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import React from "react";
import SwipeableViews from "react-swipeable-views";

import { ImageData } from "./imageData";

type Props = {
  imageData: ImageData[];
  displayLabelText: boolean;
};

/** Carousel compoent for showing images. */
export const ImageSlider: React.VFC<Props> = ({ imageData, displayLabelText }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const maxSteps = imageData.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Box>
      {displayLabelText && (
        <Paper square elevation={0}>
          <Grid container direction="column" alignItems="center" justifyContent="center">
            <Grid item>
              <Typography variant="h4">{imageData[activeStep].label}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {imageData.map((step, index) => (
          <Box key={index} display="flex" justifyContent="center" position="relative" height={{ xs: 300, md: 400 }}>
            {Math.abs(activeStep - index) <= 2 && (
              <Image
                alt={step.label}
                src={step.img}
                placeholder="blur"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
          </Box>
        ))}
      </SwipeableViews>

      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        variant="text"
        sx={{ ...theme.typography.subtitle2, bgcolor: "transparent" }}
        nextButton={
          <Button color="contrast" size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Neste
            {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button color="contrast" size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Forrige
          </Button>
        }
      />
    </Box>
  );
};
