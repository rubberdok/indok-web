import type { ErrorLike } from "@apollo/client";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

type Props = {
  handleErrorDialogClose: () => void;
  error?: ErrorLike;
};

/** Displays the error message in a dialog. */
export const ErrorDialog: React.VFC<Props> = ({ handleErrorDialogClose, error }) => (
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
