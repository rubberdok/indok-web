import { RefObject } from "react";
import styled from "styled-components";
import React from "react";

interface InputProps {
    required: boolean;
    type: string;
    placeholder: string;
    ref: RefObject<HTMLInputElement>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, forwardedRef) => (
    <StyledInput ref={forwardedRef} placeholder={props.placeholder} type={props.type} required={props.required} />
));

const StyledInput = styled.input`
    background: ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.primary};
    display: grid;
    color: #fff;
    font-family: "Montserrat";
    font-size: 18px;
    text-decoration: none !important;
    margin-bottom: 10px;
    padding: 10px;
    background: linear-gradient(
            to bottom,
            ${({ theme }) => theme.colors.primary} 50%,
            ${({ theme }) => theme.colors.background} 50%
        )
        top;
    background-size: 100% 200%;
    transition: all 0.2s ease-in-out;

    &:hover {
    }

    &:focus {
        background-position: 0% 100%;
        color: black;
        outline: none;
        background-color: #fff;
    }
`;

Input.displayName = "Input"; // hvorfor?

export default Input;
