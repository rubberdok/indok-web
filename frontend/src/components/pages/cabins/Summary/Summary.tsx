import { CompositionProps } from "@atomic-layout/core";
import { Composition } from "atomic-layout";
import React, { Fragment } from "react";
import styled from "styled-components";
import { Card } from "../CardC";
import Facilities from "./Facilities";

const templateDesktop = `
    cabin cabin
    from to
    facs facs
    price price
    total total
`;

const templateMobile = `
    cabin
    from
    to
    facs
    price
    total
`;

interface SummaryProps {
  from: string;
  to: string;
  cabin: string;
  price: number;
  nights: number;
}

const VerticalSep = styled.hr`
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  width: 80%;
  height: ${(p: { height: number }) => p.height}px;
`;

const Summary = ({ from, to, cabin, price, nights }: SummaryProps): JSX.Element => {
  return (
    <Card>
      <Composition
        templateXs={templateMobile}
        templateMd={templateDesktop}
        templateColsMdOnly="minmax(100px, 1fr) 1fr"
        padding={0}
        gutter={0}
        gutterLg={0}
      >
        {({ Cabin, From, To, Facs, Price, Total }: CompositionProps) => (
          <Fragment>
            <Cabin>
              <h3>Hytte: {cabin}</h3>
              <VerticalSep height={4} />
            </Cabin>
            <From>
              <p>Fra: {from}</p>
            </From>
            <To>
              <p>Til: {to}</p>
            </To>
            <Facs>
              <VerticalSep height={2} />
              <Facilities></Facilities>
            </Facs>
            <Price>
              <VerticalSep height={2} />

              <p>
                {price} kr x {nights} dager
              </p>
            </Price>
            <Total>
              <VerticalSep height={4} />
              <p>
                <b>Totalt: {price * nights}kr</b>
              </p>
            </Total>
          </Fragment>
        )}
      </Composition>
    </Card>
  );
};

export default Summary;
