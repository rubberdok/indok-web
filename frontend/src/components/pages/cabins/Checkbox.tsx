/* eslint-disable jsx-a11y/anchor-is-valid */
import { ContractProps } from "@interfaces/cabins";
import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";

interface CheckProps {
  checked: boolean;
  onClick: () => void;
  errorMsg: string;
  checkable: boolean;
  contractData: ContractProps;
}

const CheckBox: React.FC<CheckProps> = ({ checked, onClick, errorMsg, checkable, contractData }) => {
  const [contractViewed, setContractViewed] = useState(false);

  const contractLinkClick = () => {
    setContractViewed(true);
  };

  return (
    <>
      <CheckboxWrapper status={errorMsg}>
        <input type="checkbox" onChange={onClick} checked={checked} disabled={!(checkable && contractViewed)}></input>
        <LabelText>
          Jeg har lest gjennom og samtykker til{" "}
          <Link href="./rules" passHref>
            <a aria-hidden="true" target="_blank" rel="noreferrer">
              retningslinjene
            </a>
          </Link>{" "}
          for booking av hytte og godtar
          <Link href={{ pathname: "./contract", query: contractData.contractData }} passHref>
            <a aria-hidden="true" onClick={contractLinkClick} target="_blank" rel="noreferrer">
              {" "}
              kontrakten
            </a>
          </Link>
          .
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
