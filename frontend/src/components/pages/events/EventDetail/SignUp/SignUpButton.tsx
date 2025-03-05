import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import { useContext, useState } from "react";

import dayjs from "@/lib/date";
import { UserContext } from "@/pages/events/[id]";

type Event = {
  signupOpenDate: string;
  isFull?: boolean | null;
  allowedGradeYears?: Array<number> | null;
  isAttendable: boolean;
};

type User = {
  gradeYear?: number | null;
};

type Props = {
  isSignedUp?: boolean | null;
  disabled?: boolean;
  onSignUp: () => void;
  onSignOff: () => void;
  event: Event;
};

function isWaitList(event: Event, user: User) {
  const signUpOpenDate = event.signupOpenDate ? dayjs(event.signupOpenDate) : undefined;
  const isSignUpOpen = signUpOpenDate && dayjs().isSameOrAfter(signUpOpenDate);

  let canAttend = event.isAttendable && isSignUpOpen;
  if (user.gradeYear && event.allowedGradeYears) {
    canAttend = canAttend && event.allowedGradeYears.includes(user.gradeYear);
  }

  return event.isFull && canAttend;
}

export const SignUpButton: React.FC<Props> = ({ isSignedUp, onSignUp, onSignOff, disabled, event }) => {
  const [confirmSignOff, setConfirmSignOff] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useContext(UserContext);

  function handleSignUp() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
    onSignUp();
  }

  function handleSignOff() {
    setLoading(true);
    setConfirmSignOff(false);
    setTimeout(() => setLoading(false), 1000);
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
          <LoadingButton loading={loading} onClick={handleSignOff} color="error" variant="contained">
            Meld av
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {isSignedUp && (
        <LoadingButton
          fullWidth
          loading={loading}
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
        <LoadingButton fullWidth loading={loading} variant="contained" onClick={handleSignUp} disabled={disabled}>
          {user != null && isWaitList(event, user) ? "Meld på venteliste" : "Meld på"}
        </LoadingButton>
      )}
    </>
  );
};
