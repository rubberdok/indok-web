import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import { useState } from "react";

type Props = {
  isSignedUp?: boolean | null;
  disabled?: boolean;
  onSignUp: () => void;
  onSignOff: () => void;
};

export const SignUpButton: React.FC<Props> = ({ isSignedUp, onSignUp, onSignOff, disabled }) => {
  const [confirmSignOff, setConfirmSignOff] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSignUp() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
    onSignUp();
  }

  function handleSignOff() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
    onSignOff();
  }

  if (isSignedUp) {
    return (
      <>
        <Dialog open={confirmSignOff}>
          <DialogContent>
            <Typography>Er du sikker på at du vil melde deg av?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmSignOff(false)}>Avbryt</Button>
            <LoadingButton loading={loading} onClick={handleSignOff} color="error" variant="contained">
              Meld av
            </LoadingButton>
          </DialogActions>
        </Dialog>
        <LoadingButton loading={loading} variant="outlined" onClick={() => setConfirmSignOff(true)} disabled={disabled}>
          Meld av
        </LoadingButton>
      </>
    );
  }

  return (
    <LoadingButton loading={loading} variant="contained" onClick={handleSignUp} disabled={disabled}>
      Meld på
    </LoadingButton>
  );
};
