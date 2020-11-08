import Link from "next/link";
import React from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "react-feather";
import styled from "styled-components";

interface ArrowProps {
    direction: string;
    size?: number;
    href?: string;
    onClick?: () => void;
}

export const ArrowIcon = ({ direction, size, href, onClick }: ArrowProps): JSX.Element => {
    return (
        <IconWrapper onClick={onClick}>
            {href ? (
                <Link href={href}>
                    <Arrow direction={direction}>
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
            ) : (
                <div>
                    <Arrow direction={direction}>
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
                </div>
            )}
        </IconWrapper>
    );
};

const Arrow = styled.div`
    transition: all 0.2s ease-in-out;
    transform-origin: ${(props: ArrowProps) => (props.direction == "l" ? "60% 50%" : "40% 50%")};
    &:hover {
        cursor: pointer;
        transform: scale(1.1);
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const IconWrapper = styled.div`
    padding: 10px;
`;
