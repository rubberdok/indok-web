import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { Box, Grid, Theme, Typography } from "@material-ui/core";

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

interface imageSliderProps {
  imageData: ImageData[];
  displayLabelText: boolean;
}

const ImageSlider = ({ imageData, displayLabelText }: imageSliderProps): JSX.Element => {
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
          <Grid container direction="column" alignItems="center" justify="center">
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
            <Box key={index}>
              {Math.abs(activeStep - index) <= 2 ? (
                <img className={classes.img} src={step.imgPath} alt={step.label} />
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
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next
            {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Back
          </Button>
        }
      />
    </Box>
  );
};

export default ImageSlider;
