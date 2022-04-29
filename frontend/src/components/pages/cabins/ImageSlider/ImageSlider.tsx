import React from "react";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { Box, Grid, Theme, Typography } from "@mui/material";
import Image from "next/image";

const useStyles = makeStyles((theme: Theme) => ({
  img: {
    height: "100%",
    display: "block",
    maxWidth: "100%",
    overflow: "hidden",
    width: "100%",
  },
  mobileStepper: {
    backgroundColor: theme.palette.background.paper,
  },
}));

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
  const classes = useStyles();
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
      <Box>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          disableLazyLoading
        >
          {imageData.map((step, index) => (
            <Box key={index} display="flex" justifyContent="center">
              {Math.abs(activeStep - index) <= 2 ? (
                <Image alt={step.label} src={step.imgPath} width={400} height={300} />
              ) : null}
            </Box>
          ))}
        </SwipeableViews>
      </Box>

      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        className={classes.mobileStepper}
        variant="text"
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Neste
            {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Forrige
          </Button>
        }
      />
    </Box>
  );
};

export default ImageSlider;
