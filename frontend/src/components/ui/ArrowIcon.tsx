import Link from "next/link";
import React from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "react-feather";

interface ArrowProps {
    direction: string;
    size: number;
    href: string;
}

export const ArrowIconLink = ({ direction, size, href }: ArrowProps): JSX.Element => {
    return (
        <Link href={href}>
            {direction == "r" ? (
                <ArrowRight size={size}></ArrowRight>
            ) : direction == "l" ? (
                <ArrowLeft size={size}></ArrowLeft>
            ) : direction == "u" ? (
                <ArrowUp size={size}></ArrowUp>
            ) : (
                <ArrowDown size={size}></ArrowDown>
            )}
        </Link>
    );
};
