import { ContractProps } from "@interfaces/cabins";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import styled from "styled-components";

interface CheckProps {
    checked: boolean;
    onClick: () => void;
    errorMsg: string;
    checkable: boolean;
    contractData: ContractProps;
}

const CheckBox = ({ checked, onClick, errorMsg, checkable, contractData }: CheckProps): JSX.Element => {

    const [contractViewed, setContractViewed] = useState(false);

    const contractOverlayClick = () => {
        setContractViewed(true);
    }

    return (
        <>
            <CheckboxWrapper status={errorMsg}>
                <input type="checkbox" onChange={onClick} checked={checked} disabled={!(checkable && contractViewed)}></input>
                <LabelText>
                    Jeg har lest gjennom og samtykker til <Link href="# ">retningslinjene</Link> for booking av hytte og
                    godtar
                    <span onClick={contractOverlayClick}><Link href={{ pathname: "./contract", query: contractData.contractData }}> kontrakten</Link>.</span>
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
