import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  DialogActions,
  Button,
} from "@material-ui/core";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { SendEmailProps } from ".";
import ClearIcon from "@material-ui/icons/Clear";

interface ConfirmationDialogProps {
  showConfirmation: boolean;
  setShowConfirmation: Dispatch<SetStateAction<boolean>>;
  emailProps: SendEmailProps;
  handleConfirmationClose: () => void;
}

const ConfirmationDialog = ({
  showConfirmation,
  setShowConfirmation,
  emailProps,
  handleConfirmationClose,
}: ConfirmationDialogProps) => {
  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={showConfirmation}
      onClose={(_e) => setShowConfirmation(false)}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="max-width-dialog-title">Mail sendt</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <b>
            Mail sendt til følgende {emailProps.receiverEmails.length > 1 ? emailProps.receiverEmails.length : ""}{" "}
            adresse{emailProps.receiverEmails.length > 1 ? "r" : ""}:
          </b>{" "}
          <br />
          {emailProps.receiverEmails.map((email, index) => (
            <Typography key={index} component="span">
              {email}
              <br />
            </Typography>
          ))}
        </DialogContentText>
        <DialogContentText variant="body2">
          Kontakt <Link href="mailto:hswebkom@gmail.com">web@indokhs.no</Link> dersom det skulle oppstå spørsmål.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={(_e) => handleConfirmationClose()} color="primary">
          <ClearIcon />
          Lukk
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
