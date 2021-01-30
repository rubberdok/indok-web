import Navbar from "@components/navbar/Navbar";
import CabinBooker from "@components/pages/cabins/CabinBooker/CabinBooker";
import { Typography } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 800px;
`;

const CreateBookingPage: NextPage = () => {
  return (
    <div>
      <Navbar />
      <Typography>
        OBS: Hyttebooking via nettsiden er fortsatt under utvikling, og denne siden er kun til demonstrasjon.
      </Typography>
      <Container>
        <CabinBooker />
      </Container>
    </div>
  );
};

export default CreateBookingPage;
