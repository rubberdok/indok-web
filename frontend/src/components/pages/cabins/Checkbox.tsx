/* eslint-disable jsx-a11y/anchor-is-valid */
import { ContractProps } from "@interfaces/cabins";
import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";

interface CheckProps {
  checked: boolean;
  onClick: (isChecked: boolean) => void;
  errorMsg: string;
  checkable: boolean;
  contractData: ContractProps;
}

const CheckBox: React.FC<CheckProps> = ({ checked, onClick, errorMsg, checkable, contractData }) => {
  const [contractViewed, setContractViewed] = useState(false);
  const [checkErrorMsg, setCheckErrorMsg] = useState(""); // error message if checking when not allowed
  checked = false;

  const contractLinkClick = () => {
    setContractViewed(true);
  };

  const realCheckboxOnclick = (e: React.FormEvent<EventTarget>) => {
    onClick(!checked);
    setCheckErrorMsg("");
  };

  const fakeCheckboxOnclick = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    setCheckErrorMsg("Du må lese kontrakten og fylle inn alle feltene først.");
  };

  return (
    <>
      <CheckboxWrapper status={errorMsg}>
        {
          contractViewed && checkable ? (
            // display fake checkbox if contract hasnt been viewed and all input fields havent been filled

            // <input type="checkbox" onChange={onClick} onClick={e => setCheckErrorMsg("")}></input> :
            <input type="checkbox" onClick={realCheckboxOnclick}></input>
          ) : (
            <input type="checkbox" onClick={fakeCheckboxOnclick}></input>
          ) // fake input
        }

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
          .<br />
          <ErrorEl>{checkErrorMsg}</ErrorEl>
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

const ErrorEl = styled.p`
  color: red;
  display: inline;
`;

export default CheckBox;
