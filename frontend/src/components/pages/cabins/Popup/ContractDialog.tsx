import { Check, Clear } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, Grid, IconButton } from "@mui/material";
import { NextPage } from "next";
import { Dispatch, SetStateAction } from "react";

import { Cabin, ContactInfo, DatePick, ModalData } from "@/interfaces/cabins";

import Contract from "../Documents/Contract";

type ContractDialogProps = {
  modalData: ModalData;
  setModalData: Dispatch<SetStateAction<ModalData>>;
  datePick: DatePick;
  chosenCabins: Cabin[];
  contactInfo: ContactInfo;
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
};

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
                <Clear />
              </IconButton>
            </Grid>
            <Grid item>
              <Contract chosenCabins={chosenCabins} datePick={datePick} contactInfo={contactInfo} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: (theme) => theme.palette.background.elevated }}>
          <Button size="large" onClick={handleClose} color="primary" startIcon={<Clear />}>
            Lukk
          </Button>
          <Button size="large" onClick={handleAccept} color="primary" startIcon={<Check />}>
            Jeg samtykker til kontrakten
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContractDialog;
