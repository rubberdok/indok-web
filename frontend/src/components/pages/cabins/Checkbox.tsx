import Link from "next/link";
import React from "react";
import styled from "styled-components";

interface CheckProps {
    checked: boolean;
    onClick: () => void;
    errorMsg: string;
}

const CheckBox = ({ checked, onClick, errorMsg }: CheckProps): JSX.Element => {
    return (
        <>
            <CheckboxWrapper status={errorMsg}>
                <input type="checkbox" onClick={onClick} onChange={onClick} checked={checked}></input>

                <LabelText>
                    Jeg har lest gjennom og samtykker til <Link href="# ">retningslinjene</Link> for booking av hytte og
                    godtar
                    <Link href="#"> kontrakten</Link>.
                </LabelText>
            </CheckboxWrapper>
        </>
    );
};

const CheckboxWrapper = styled.label`
    padding: 5px;
    border: ${(props: { status: string }) => (props.status == "" ? "none" : "2px solid red")};
`;

const LabelText = styled.span`
    padding: 5px;
    width: 50vh;
`;

export default CheckBox;
