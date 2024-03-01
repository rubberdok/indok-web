import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import { useState } from "react";

type Props = {
  isSignedUp?: boolean | null;
  disabled?: boolean;
  onSignUp: () => void;
  onSignOff: () => void;
  loading?: boolean;
};

export const SignUpButton: React.FC<Props> = ({ isSignedUp, onSignUp, onSignOff, disabled, loading }) => {
  const [confirmSignOff, setConfirmSignOff] = useState(false);
  const [loadingBuffer, setLoadingBuffer] = useState(false);
  const isLoading = loading || loadingBuffer;

  function handleSignUp() {
    setLoadingBuffer(true);
    setTimeout(() => setLoadingBuffer(false), 500);
    onSignUp();
  }

  function handleSignOff() {
    setLoadingBuffer(true);
    setConfirmSignOff(false);
    setTimeout(() => setLoadingBuffer(false), 500);
    onSignOff();
  }

  return (
    <>
      <Dialog open={confirmSignOff}>
        <DialogContent>
          <Typography>Er du sikker på at du vil melde deg av?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmSignOff(false)}>Avbryt</Button>
          <LoadingButton loading={isLoading} onClick={handleSignOff} color="error" variant="contained">
            Meld av
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {isSignedUp && (
        <LoadingButton
          fullWidth
          loading={isLoading}
          variant="outlined"
          onClick={() => {
            setConfirmSignOff(true);
          }}
          disabled={disabled}
        >
          Meld av
        </LoadingButton>
      )}
      {!isSignedUp && (
        <LoadingButton fullWidth loading={isLoading} variant="contained" onClick={handleSignUp} disabled={disabled}>
          Meld på
        </LoadingButton>
      )}
    </>
  );
};
