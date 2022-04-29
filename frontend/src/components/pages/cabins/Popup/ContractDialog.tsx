import React, { Dispatch, SetStateAction } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Grid, IconButton, Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import Contract from "../Documents/Contract";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { Cabin, ContactInfo, DatePick, ModalData } from "@interfaces/cabins";
import { NextPage } from "next";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogFooter: {
      backgroundColor: theme.palette.background.default,
    },
  })
);

interface ContractDialogProps {
  modalData: ModalData;
  setModalData: Dispatch<SetStateAction<ModalData>>;
  datePick: DatePick;
  chosenCabins: Cabin[];
  contactInfo: ContactInfo;
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

/*
Dialog component for the contract component
*/
const ContractDialog: NextPage<ContractDialogProps> = ({
  modalData,
  setModalData,
  datePick,
  chosenCabins,
  contactInfo,
  activeStep,
  setActiveStep,
}) => {
  const classes = useStyles();

  const handleClose = () => {
    setModalData({ ...modalData, displayPopUp: false });
  };

  const handleAccept = () => {
    setModalData({ displayPopUp: false, contractViewed: true });
    setActiveStep(activeStep + 1);
  };

  return (
    <>
      <Dialog open={modalData.displayPopUp} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent>
          <Grid container alignContent="center" spacing={3}>
            <Grid item>
              <IconButton onClick={() => setModalData({ ...modalData, displayPopUp: false })} size="large">
                <ClearIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Contract chosenCabins={chosenCabins} datePick={datePick} contactInfo={contactInfo} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.dialogFooter}>
          <Button size="large" onClick={handleClose} color="primary" startIcon={<ClearIcon />}>
            Lukk
          </Button>
          <Button size="large" onClick={handleAccept} color="primary" startIcon={<CheckIcon />}>
            Jeg samtykker til kontrakten
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContractDialog;
