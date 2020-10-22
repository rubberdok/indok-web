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
    font-family: "Montserrat";
    font-size: 17px;
    padding: 10px;
    text-decoration: none !important;
    background: linear-gradient(
            to bottom,
            ${({ theme }) => theme.colors.primary} 50%,
            ${({ theme }) => theme.colors.background} 50%
        )
        top;
    background-size: 100% 200%;
    transition: all 0.2s ease-in-out;
    color: white;

    ::placeholder {
        color: white;
    }

    &:hover {
    }

    &:focus {
        background-position: 0% -100%;
        outline: none;
        color: ${({ theme }) => theme.colors.primary};
        ::placeholder {
            color: ${({ theme }) => theme.colors.primary};
        }
    }
`;

Input.displayName = "Input";

export default Input;
