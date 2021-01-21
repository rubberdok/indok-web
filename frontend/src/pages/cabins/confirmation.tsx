import Layout from "@components/Layout";
import { Heading, Paragraph } from "@components/ui/Typography";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

const Confirmation = () => {
  return (
    <>
      <Layout>
        <Container>
          <Heading>Bekreftelse for booking</Heading>
          <Paragraph>
            Takk for din booking! Denne nettsiden er fortsatt under konstruksjon, så det blir ikke faktisk opprettet en
            booking. Det må du fortsatt gjøre gjennom{" "}
            <Link href="mailto:booking@indokhyttene.no">booking@indokhyttene.no</Link>.
          </Paragraph>
        </Container>
      </Layout>
    </>
  );
};

const Container = styled.div`
  margin: auto;
  width: 70%;
  padding: 50px;
`;

export default Confirmation;
