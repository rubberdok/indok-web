import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

type Props = {
  open: boolean;
  title: string;
  description: string;
  /** Whether the booker gets a mail, and so whether a message can go with it. */
  allowMessage: boolean;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: (message: string) => void;
};

/** Asks before a booking or a request is deleted for good. Give it a new key for each deletion. */
export const DeleteDialog: React.FC<Props> = ({
  open,
  title,
  description,
  allowMessage,
  deleting,
  onCancel,
  onConfirm,
}) => {
  const [message, setMessage] = useState("");

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>{description}</DialogContentText>
        {allowMessage ? (
          <TextField
            label="Melding til bestilleren (valgfritt)"
            helperText="Sendes med e-posten om at bookingen er slettet."
            multiline
            minRows={2}
            fullWidth
            margin="normal"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Avbryt</Button>
        <Button color="error" variant="contained" onClick={() => onConfirm(message)} disabled={deleting}>
          Slett for godt
        </Button>
      </DialogActions>
    </Dialog>
  );
};
