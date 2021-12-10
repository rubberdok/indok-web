import { Snackbar as MuiSnackbar, SnackbarCloseReason } from "@material-ui/core";
import { Alert as MuiAlert } from "@material-ui/lab";
import React from "react";

type AlertProps = {
  open: boolean;
  onClose: ((event: React.SyntheticEvent<any, globalThis.Event>, reason: SnackbarCloseReason) => void) | undefined;
  severity: "success" | "info" | "warning" | "error";
  description: string | undefined;
};

/**
 * Component for alerts
 */
const Alert: React.FC<AlertProps> = ({ open, onClose, description, severity }) => {
  return (
    <MuiSnackbar
      autoHideDuration={10000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      onClose={onClose}
    >
      <MuiAlert elevation={6} variant="filled" severity={severity}>
        {description}
      </MuiAlert>
    </MuiSnackbar>
  );
};

export default Alert;
