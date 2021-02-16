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
import { Container } from "@material-ui/core";
import CardC from "../CardC";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const imageData = {
  bjørnen: [
    {
      label: "Bjørnen 1",
      imgPath: "/static/cabins/bilde01.jpg",
    },
    {
      label: "Bjørnen 2",
      imgPath: "/static/cabins/bilde02.jpg",
    },
    {
      label: "Bjørnen 3",
      imgPath: "/static/cabins/bilde03.jpg",
    },
    {
      label: "Bjørnen 4",
      imgPath: "/static/cabins/bilde04.jpg",
    },
    {
      label: "Bjørnen 5",
      imgPath: "/static/cabins/bilde05.jpg",
    },
    {
      label: "Bjørnen 6",
      imgPath: "/static/cabins/bilde06.jpg",
    },
  ],
  oksen: [
    {
      label: "Oksen 1",
      imgPath: "/static/cabins/bilde01.jpg",
    },
    {
      label: "Oksen 2",
      imgPath: "/static/cabins/bilde02.jpg",
    },
    {
      label: "Oksen 3",
      imgPath: "/static/cabins/bilde03.jpg",
    },
    {
      label: "Oksen 4",
      imgPath: "/static/cabins/bilde04.jpg",
    },
    {
      label: "Oksen 5",
      imgPath: "/static/cabins/bilde05.jpg",
    },
    {
      label: "Oksen 6",
      imgPath: "/static/cabins/bilde06.jpg",
    },
  ],
};

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "90%",
    flexGrow: 1,
    margin: "auto",
    borderRadius: "10px",
    backgroundColor: theme.palette.background.paper,
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    backgroundColor: theme.palette.background.paper,
    textAlign: "center",
  },
  img: {
    height: "100%",
    display: "block",
    maxWidth: "100%",
    overflow: "hidden",
    width: "100%",
    margin: "auto",
    borderRadius: "20px",
  },
  cabin: {
    margin: "auto",
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
      : cabins == "Bjørnen"
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
    <Container>
      <CardC>
        <div className={classes.root}>
          <Paper square elevation={0} className={classes.header}>
            <h2 className={classes.cabin}>{images[activeStep].label}</h2>
          </Paper>
          <AutoPlaySwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
          >
            {images.map((step, index) => (
              <div key={step.label}>
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
        </div>
      </CardC>
    </Container>
  );
};

export default ImageSlider;
