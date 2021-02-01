import { ImageSliderProps } from "@interfaces/cabins";
import { Card, Container, createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import Carousel from "react-material-ui-carousel";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.primary,
    },
    card: {
      padding: "20px",
      boxShadow: "0px 7px 17px -1px rgba(92, 92, 92, 0.62)",
      borderRadius: "15px",
      textAlign: "center",
    },
    img: {
      borderRadius: "10px",
    },
    carousel: {
      width: "90%",
      margin: "auto",
    },
  })
);

const images = {
  bjørnen: [
    "/static/cabins/bilde01.jpg",
    "/static/cabins/bilde02.jpg",
    "/static/cabins/bilde03.jpg",
    "/static/cabins/bilde04.jpg",
    "/static/cabins/bilde05.jpg",
    "/static/cabins/bilde06.jpg",
  ],
  oksen: [],
};

const ImageSlider = ({ cabin }: ImageSliderProps) => {
  const classes = useStyles();

  return (
    <Container>
      <Card className={classes.card}>
        <Carousel timeout={500} navButtonsAlwaysVisible={true} autoPlay={false} className={classes.carousel}>
          {cabin == "Bjørnen"
            ? images.bjørnen.map((link) => (
                <div key={link}>
                  <img alt={cabin} src={link} className={classes.img}></img>
                </div>
              ))
            : images.oksen.map((link) => (
                <div key={link}>
                  <img alt={cabin} src={link}></img>
                </div>
              ))}
        </Carousel>
      </Card>
    </Container>
  );
};

export default ImageSlider;
