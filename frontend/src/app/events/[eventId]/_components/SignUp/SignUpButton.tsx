import { SignUpAvailability } from "@/gql/app/graphql";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import { useState } from "react";

type Props = {
  disabled?: boolean;
  onSignUp: () => void;
  onSignOff: () => void;
  loading?: boolean;
  type: SignUpAvailability;
};

export const SignUpButton: React.FC<Props> = ({ onSignUp, onSignOff, disabled, loading, type }) => {
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
          <Button onClick={() => setConfirmSignOff(false)} color="secondary">
            Avbryt
          </Button>
          <LoadingButton loading={isLoading} onClick={handleSignOff} color="error" variant="contained">
            Meld av
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {type === SignUpAvailability.OnWaitlist && (
        <LoadingButton
          fullWidth
          loading={isLoading}
          variant="outlined"
          onClick={() => {
            setConfirmSignOff(true);
          }}
          disabled={disabled}
        >
          Meld av venteliste
        </LoadingButton>
      )}
      {type === SignUpAvailability.Confirmed && (
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
      {type === SignUpAvailability.WaitlistAvailable && (
        <LoadingButton
          fullWidth
          loading={isLoading}
          variant="outlined"
          color="secondary"
          onClick={handleSignUp}
          disabled={disabled}
        >
          Meld på venteliste
        </LoadingButton>
      )}
      {type === SignUpAvailability.Available && (
        <LoadingButton fullWidth loading={isLoading} variant="contained" onClick={handleSignUp} disabled={disabled}>
          Meld på
        </LoadingButton>
      )}
      {type === SignUpAvailability.Closed && (
        <Button fullWidth variant="outlined" disabled>
          Påmeldingen er stengt
        </Button>
      )}
      {type === SignUpAvailability.Unavailable && (
        <Typography variant="body2" color="textSecondary" align="center">
          Påmelding ikke tilgjengelig
        </Typography>
      )}
      {type === SignUpAvailability.NotOpen && (
        <LoadingButton fullWidth variant="contained" disabled>
          Meld på
        </LoadingButton>
      )}
      {type === SignUpAvailability.Disabled && (
        <Button fullWidth variant="outlined" disabled>
          Påmeldingen er stengt
        </Button>
      )}
    </>
  );
};
