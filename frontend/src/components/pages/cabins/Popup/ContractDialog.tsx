import React, { Dispatch, SetStateAction } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { createStyles, Grid, IconButton, makeStyles, Theme } from "@material-ui/core";
import Contract from "../Documents/Contract";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import { Cabin, ContactInfo } from "@interfaces/cabins";
import { ModalData, DatePick } from "src/pages/cabins/book";

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

const ContractDialog = ({
  modalData,
  setModalData,
  datePick,
  chosenCabins,
  contactInfo,
  activeStep,
  setActiveStep,
}: ContractDialogProps) => {
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
              <IconButton onClick={(_e) => setModalData({ ...modalData, displayPopUp: false })}>
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
