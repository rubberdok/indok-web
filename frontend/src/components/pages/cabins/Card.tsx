import React from "react";
import styled from "styled-components";

interface CardProps {
    children: React.ReactNode;
}

interface CardElProps {
    children: React.ReactNode;
    inline?: boolean;
}

export const Card = ({ children }: CardProps): JSX.Element => {
    return (
        <>
            <StyledDiv>{children}</StyledDiv>
        </>
    );
};

const StyledDiv = styled.div`
    padding: 20px;
    box-shadow: 0px 7px 17px -1px rgba(92, 92, 92, 0.62);
    border-radius: 15px;
    text-align: center;
`;
