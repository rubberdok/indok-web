import React, { Fragment } from "react";
import styled from "styled-components";

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <Fragment>
      <StyledDiv>{children}</StyledDiv>
    </Fragment>
  );
};

const StyledDiv = styled.div`
  padding: 20px;
  box-shadow: 0px 7px 17px -1px rgba(92, 92, 92, 0.62);
  border-radius: 15px;
  text-align: center;
`;
