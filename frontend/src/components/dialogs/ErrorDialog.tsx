import { ApolloError } from "@apollo/client";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import React from "react";

type Props = {
  handleErrorDialogClose: () => void;
  error?: ApolloError;
};

/*
Displays the error message in a dialog.
 */
const ErrorDialog: React.VFC<Props> = ({ handleErrorDialogClose, error }) => (
  <Dialog open={error != undefined} onClose={handleErrorDialogClose}>
    <DialogTitle>{`Det har oppstått en feilmelding: ${error?.name}`}</DialogTitle>
    <DialogContent>
      <DialogContentText>{error?.message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleErrorDialogClose} color="primary" variant="contained">
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

export default ErrorDialog;
