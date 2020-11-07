import Link from "next/link";
import React from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "react-feather";
import styled from "styled-components";

interface ArrowProps {
    direction: string;
    size: number;
    href?: string;
}

export const ArrowIcon = ({ direction, size, href }: ArrowProps): JSX.Element => {
    return (
        <IconWrapper>
            <Link href={href}>
                <Arrow>
                    {direction == "r" ? (
                        <ArrowRight size={size}></ArrowRight>
                    ) : direction == "l" ? (
                        <ArrowLeft size={size}></ArrowLeft>
                    ) : direction == "u" ? (
                        <ArrowUp size={size}></ArrowUp>
                    ) : (
                        <ArrowDown size={size}></ArrowDown>
                    )}
                </Arrow>
            </Link>
        </IconWrapper>
    );
};

const Arrow = styled.div`
    transition: all 0.2s ease-in-out;
    transform-origin: 150% 50%;
    &:hover {
        cursor: pointer;
        transform: scale(1.1);
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const IconWrapper = styled.div`
    padding: 10px;
`;
