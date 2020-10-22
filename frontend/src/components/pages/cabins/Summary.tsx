import React from "react";
import { Composition } from "atomic-layout";
import { Paragraph } from "@components/ui/Typography";
import { Card } from "./Card";
import styled from "styled-components";

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
                padding={10}
                gutter={15}
                gutterLg={25}
            >
                {({ From, To, Cabin, Price, Total }) => (
                    <>
                        <From>
                            <Paragraph>Fra: {from}</Paragraph>
                        </From>
                        <To>
                            <Paragraph>Til: {to}</Paragraph>
                        </To>
                        <Cabin>
                            <VerticalSep height={2} />
                            <Paragraph>Hytte: {cabin}</Paragraph>
                        </Cabin>
                        <Price>
                            <VerticalSep height={2} />

                            <Paragraph>
                                {price} kr x {nights} dager
                            </Paragraph>
                        </Price>
                        <Total>
                            <VerticalSep height={4} />
                            <Paragraph>
                                <b>Totalt: {price * nights}kr</b>
                            </Paragraph>
                        </Total>
                    </>
                )}
            </Composition>
        </Card>
    );
};

export default Summary;
