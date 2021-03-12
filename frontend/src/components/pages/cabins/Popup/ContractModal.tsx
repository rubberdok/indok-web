import React, { Dispatch, SetStateAction } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { DatePick, ModalData } from "src/pages/cabins/book";
import { Button, Grid, IconButton, Typography } from "@material-ui/core";
import { Cabin, ContactInfo } from "@interfaces/cabins";
import Contract2 from "../Documents/Contract2.0";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "80%",
      margin: "30px auto",
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      outline: "none",
    },
    modalStyle: {
      overflow: "scroll",
    },
    acceptButton: {
      width: "100%",
      padding: "20px",
      backgroundColor: theme.palette.primary.light,
    },
  })
);

interface ContractModalProps {
  modalData: ModalData;
  setModalData: Dispatch<SetStateAction<ModalData>>;
  datePick: DatePick;
  chosenCabins: Cabin[];
  contactInfo: ContactInfo;
}

const ContractModal = ({ modalData, setModalData, datePick, chosenCabins, contactInfo }: ContractModalProps) => {
  const classes = useStyles();

  const handleClose = () => {
    setModalData({ ...modalData, displayPopUp: false });
  };

  const handleAccept = () => {
    setModalData({ displayPopUp: false, contractViewed: true });
  };

  return (
    <Modal open={modalData.displayPopUp} onClose={handleClose} className={classes.modalStyle}>
      <Grid container sm={12} md={8} alignContent="center" spacing={3} className={classes.paper}>
        <Grid item>
          <IconButton onClick={(_e) => setModalData({ ...modalData, displayPopUp: false })}>
            <ClearIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <Contract2 chosenCabins={chosenCabins} datePick={datePick} contactInfo={contactInfo} />
        </Grid>
        <Grid item container sm={12}>
          <Button onClick={(_e) => handleAccept()} className={classes.acceptButton}>
            <Typography variant="body2">Jeg samtykker til kontrakten</Typography>
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ContractModal;
