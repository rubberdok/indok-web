import Layout from "atomic-layout";
import styled from "styled-components";

export const Title = styled.h1`
  color: #222;
  font-family: "Playfair Display";
  font-weight: 900;
  font-size: 48px;
  line-height: 1.4;
  margin-bottom: 40px;
  margin-top: 40px;

  @media (max-width: ${Layout.breakpoints.md.maxWidth}) {
    font-size: 30px;
  }
`;

export const SubTitle = styled.p`
  color: #888;
  font-family: "Montserrat";
  font-weight: 300;
  font-size: 20px;
  text-transform: uppercase;
  margin-bottom: -40px;

  @media (max-width: ${Layout.breakpoints.md.maxWidth}) {
    font-size: 15px;
  }
`;

export const Heading = styled.h2`
  color: #222;
  font-family: "Playfair Display";
  font-weight: 900;
  font-size: 36px;
  margin-top: -15px;

  @media (max-width: ${Layout.breakpoints.md.maxWidth}) {
    font-size: 25px;
    margin-top: -10px;
  }
`;

export const SubHeading = styled.p`
  color: #888;
  font-family: "Montserrat";
  font-weight: 300;
  font-size: 16px;
  text-transform: uppercase;

  @media (max-width: ${Layout.breakpoints.md.maxWidth}) {
    font-size: 13px;
  }
`;

export const Paragraph = styled.p`
  color: #222;
  font-family: "Montserrat";
  font-weight: 400;
  font-size: 18px;
  margin-bottom: 30px;
`;
