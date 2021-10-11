import { Snackbar as MuiSnackbar, SnackbarCloseReason } from "@material-ui/core";
import { Alert as MuiAlert } from "@material-ui/lab";
import React from "react";

/**
 * Component for alerts
 */

interface AlertProps {
  open: boolean;
  onClose: ((event: React.SyntheticEvent<any, globalThis.Event>, reason: SnackbarCloseReason) => void) | undefined;
  severity: "success" | "info" | "warning" | "error";
  children: string | undefined;
}

const Alert: React.FC<AlertProps> = ({ open, onClose, children, severity }) => {
  return (
    <MuiSnackbar
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      onClose={onClose}
    >
      <MuiAlert elevation={6} variant="filled" severity={severity}>
        {children}
      </MuiAlert>
    </MuiSnackbar>
  );
};

export default Alert;
