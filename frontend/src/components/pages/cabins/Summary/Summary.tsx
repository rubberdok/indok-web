import React from "react";
import { Composition } from "atomic-layout";
import { Card } from "../CardC";
import styled from "styled-components";
import Facilities from "./Facilities";

const templateDesktop = `
    from to
    cabin cabin
    price price
    total total
`;

const templateMobile = `
    from
    to
    cabin
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
                {({ From, To, Cabin, Price, Total }) => (
                    <>
                        <From>
                            <p>Fra: {from}</p>
                        </From>
                        <To>
                            <p>Til: {to}</p>
                        </To>
                        <Cabin>
                            <VerticalSep height={2} />
                            <p>
                                Hytte: {cabin} <br />
                            </p>
                            <Facilities></Facilities>
                        </Cabin>
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
                    </>
                )}
            </Composition>
        </Card>
    );
};

export default Summary;
