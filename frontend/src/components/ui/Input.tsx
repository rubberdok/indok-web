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
    color: #fff;
    font-family: "Montserrat";
    font-size: 18px;
    border: none;
    display: grid;
    text-decoration: none !important;
    margin-bottom: 10px;
    padding: 10px;

    &:hover {
    }

    &:focus {
    }

    }
`;

Input.displayName = "Input"; // hvorfor?

export default Input;
