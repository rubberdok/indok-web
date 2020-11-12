import React from "react";
import { Card } from "./CardC";
import styled from "styled-components";
import Slider from "react-slick";
import { ArrowIcon } from "@components/ui/ArrowIcon";

interface ImageSliderProps {
    cabin: "Bjørnen" | "Oksen";
}

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

const ImageSlider = ({ cabin }: ImageSliderProps): JSX.Element => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        easing: "ease-in-out",
        touchMove: true,
        swipe: true,
        prevArrow: <ArrowIcon direction="l" size={25} />,
        nextArrow: <ArrowIcon direction="r" size={25} />,
    };

    return (
        <>
            <Card>
                <Container>
                    <Slider {...settings}>
                        {cabin == "Bjørnen"
                            ? images.bjørnen.map((link) => (
                                  <ImageDiv key={link}>
                                      <Img src={link}></Img>
                                  </ImageDiv>
                              ))
                            : images.oksen.map((link) => (
                                  <ImageDiv key={link}>
                                      <Img src={link}></Img>
                                  </ImageDiv>
                              ))}
                    </Slider>
                </Container>
            </Card>
        </>
    );
};

const ImageDiv = styled.div``;

const Container = styled.div`
    max-width: 500px;
    margin: auto;
    padding-bottom: 20px;
`;

const Img = styled.img`
    width: 90%;
    margin: auto;
    border-radius: 10px;
`;

export default ImageSlider;
