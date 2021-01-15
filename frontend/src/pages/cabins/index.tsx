import React from "react";
import styled from "styled-components";
import Navbar from "@components/navbar/Navbar";
import CabinBooker from "@components/pages/cabins/CabinBooker/CabinBooker";
import { Paragraph } from "@components/ui/Typography";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 800px;
`;

const CreateBookingPage = () => {
  return (
    <div>
      <Navbar />
      <Paragraph>
        OBS: Hyttebooking via nettsiden er fortsatt under utvikling, og denne siden er kun til demonstrasjon.
      </Paragraph>
      <Container>
        <CabinBooker />
      </Container>
    </div>
  );
};

export default CreateBookingPage;
