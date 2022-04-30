import useResponsive from "@hooks/useResponsive";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Box, Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import React from "react";
import SwipeableViews from "react-swipeable-views";

interface ImageData {
  label: string;
  description: string;
  imgPath: string;
}

interface ImageSliderProps {
  imageData: ImageData[];
  displayLabelText: boolean;
}

/*
Carousel compoent for showing images
*/
const ImageSlider: React.VFC<ImageSliderProps> = ({ imageData, displayLabelText }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const isMobile = useResponsive("down", "md");

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
      {displayLabelText ? (
        <Paper square elevation={0}>
          <Grid container direction="column" alignItems="center" justifyContent="center">
            <Grid item>
              <Typography variant="h4">{imageData[activeStep].label}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="overline">{imageData[activeStep].description}</Typography>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        ""
      )}
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
        disableLazyLoading
      >
        {imageData.map((step, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="center"
            position="relative"
            width={1}
            height={{ xs: 300, md: 400 }}
          >
            {Math.abs(activeStep - index) <= 2 ? (
              <Image
                layout="fill"
                alt={step.label}
                src={step.imgPath}
                height={300}
                objectFit={isMobile ? "cover" : "contain"}
                objectPosition="bottom"
              />
            ) : null}
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
          <Button color="inherit" size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Neste
            {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button color="inherit" size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Forrige
          </Button>
        }
      />
    </Box>
  );
};

export default ImageSlider;
