import Link from "next/link";
import React from "react";
import styled from "styled-components";

interface CheckProps {
    checked: boolean;
    onClick: () => void;
    errorMsg: string;
    checkable: boolean;
}

const CheckBox = ({ checked, onClick, errorMsg, checkable }: CheckProps): JSX.Element => {
    return (
        <>
            <CheckboxWrapper status={errorMsg}>
                {checkable ? (
                    <input type="checkbox" onClick={onClick} onChange={onClick} checked={checked}></input>
                ) : (
                    <input type="checkbox" onClick={onClick} onChange={onClick} checked={checked} disabled></input>
                )}

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
