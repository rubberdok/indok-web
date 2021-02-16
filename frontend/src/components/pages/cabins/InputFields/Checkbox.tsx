/* eslint-disable jsx-a11y/anchor-is-valid */
import { ContractProps } from "@interfaces/cabins";
import { Checkbox, createStyles, FormControlLabel, makeStyles } from "@material-ui/core";
import Link from "next/link";
import React, { useState } from "react";

interface CheckProps {
  onClick: (isChecked: boolean) => void;
  errorMsg: string;
  checkable: boolean;
  contractData: ContractProps;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    redBorder: {
      border: "2px solid red",
    },
    wrapper: {
      padding: "5px",
    },
    labelText: {
      padding: "5px",
      width: "50vh",
    },
    error: {
      color: "red",
      display: "inline",
    },
  })
);

const CheckBox: React.FC<CheckProps> = ({ onClick, errorMsg, checkable, contractData }) => {
  const [contractViewed, setContractViewed] = useState(false);
  const [checkErrorMsg, setCheckErrorMsg] = useState(""); // error message if checking when not allowed
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const contractLinkClick = () => {
    setContractViewed(true);
  };

  const classes = useStyles();

  const handleCheckBoxClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!(checkable && contractViewed)) {
      e.preventDefault();
      setCheckErrorMsg("Du må lese kontrakten og fylle inn alle feltene først.");
    } else {
      setCheckboxChecked(!checkboxChecked);
      onClick(!checkboxChecked);
      setCheckErrorMsg("");
    }
  };

  return (
    <>
      <div className={classes.wrapper}>
        <FormControlLabel
          control={
            <Checkbox
              onClick={(e) => handleCheckBoxClick(e)}
              checked={checkboxChecked}
              color="primary"
              inputProps={{ "aria-label": "secondary checkbox" }}
              className={errorMsg == "" ? "" : classes.redBorder}
            />
          }
          label={
            <span className={classes.labelText}>
              Jeg har lest gjennom og samtykker til{" "}
              <Link href="/cabins/rules" passHref>
                <a aria-hidden="true" target="_blank" rel="noreferrer">
                  retningslinjene
                </a>
              </Link>{" "}
              for booking av hytte og godtar
              <Link href={{ pathname: "/cabins/contract", query: contractData.contractData }} passHref>
                <a aria-hidden="true" onClick={contractLinkClick} target="_blank" rel="noreferrer">
                  {" "}
                  kontrakten
                </a>
              </Link>
              .<br />
              <p className={classes.error}>{checkErrorMsg}</p>
            </span>
          }
        />
      </div>
    </>
  );
};

export default CheckBox;
