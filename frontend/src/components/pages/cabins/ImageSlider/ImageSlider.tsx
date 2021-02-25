import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { ImageSliderProps } from "@interfaces/cabins";
import { Box, Grid, Typography } from "@material-ui/core";
import { imageData } from "./imageData";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
  img: {
    height: "100%",
    display: "block",
    maxWidth: "100%",
    overflow: "hidden",
    width: "99%",
    margin: "auto",
    borderRadius: "20px",
  },
  mobileStepper: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const ImageSlider = ({ cabins }: ImageSliderProps): JSX.Element => {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  // show all images of both cabins if both are chosen, else show only images from one
  const images =
    cabins?.length == 2
      ? imageData.bjørnen.concat(imageData.oksen)
      : cabins == ["Bjørnen"]
      ? imageData.bjørnen
      : imageData.oksen;
  const maxSteps = images.length;

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
      <Paper square elevation={0}>
        <Grid container direction="column" alignItems="center" justify="center">
          <Grid item>
            <Typography variant="h4">{images[activeStep].label}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="overline">{images[activeStep].description}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <AutoPlaySwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {images.map((step, index) => (
          <div key={index}>
            {Math.abs(activeStep - index) <= 2 ? (
              <img className={classes.img} src={step.imgPath} alt={step.label} />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
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
