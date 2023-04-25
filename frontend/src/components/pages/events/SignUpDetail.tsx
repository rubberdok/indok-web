import { useMutation } from "@apollo/client";
import { Stack, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useState } from "react";

import { LoginRequired, PermissionRequired } from "@/components/Auth";
import { EventDetailFieldsFragment, EventSignOffDocument, EventSignUpDocument } from "@/generated/graphql";

import { useCountdown } from "./hooks/useCountdown";
import { SignUpButton } from "./SignUpButton";

dayjs.extend(duration);

type CountdownStatusTextProps = {
  signupOpenDate: string;
  deadline: string;
  countdown: ReturnType<typeof useCountdown>;
};

const CountdownStatusText: React.FC<CountdownStatusTextProps> = ({ signupOpenDate, countdown, deadline }) => {
  const { timeLeft, countdownText } = countdown;

  if (dayjs.duration(timeLeft).asWeeks() > 1) {
    return <Typography>Påmelding åpner {dayjs(signupOpenDate).format("LLL")}</Typography>;
  } else if (dayjs.duration(timeLeft).asWeeks() > 0) {
    return <Typography>Påmelding åpner om {countdownText}</Typography>;
  } else if (dayjs.duration(timeLeft).asWeeks() < 0) {
    return <Typography>Påmelding stenger {dayjs(deadline).format("LLL")}</Typography>;
  } else {
    return <Typography>Påmeldingen er stengt</Typography>;
  }
};

type Event = {
  id: string;
  hasExtraInformation?: boolean | null;
  signupOpenDate: string;
  deadline: string;
  bindingSignup?: boolean | null;
} & Pick<EventDetailFieldsFragment, "userAttendance">;

type Props = {
  event: Event;
};

export const SignUpDetail: React.FC<Props> = ({ event }) => {
  const [signUp] = useMutation(EventSignUpDocument);
  const [signOff] = useMutation(EventSignOffDocument);

  const [extraInformation, setExtraInformation] = useState("");
  const countdown = useCountdown(event.signupOpenDate);

  const isSignedUp = Boolean(event.userAttendance?.isSignedUp || event.userAttendance?.isOnWaitingList);
  const needsExtraInformation = !isSignedUp && Boolean(event.hasExtraInformation && !extraInformation);
  const isBindingSignup = isSignedUp && Boolean(event.bindingSignup);
  const signUpClosed = dayjs().isAfter(event.deadline);
  const disabled = needsExtraInformation || isBindingSignup || signUpClosed;

  function handleSignUp() {
    signUp({
      variables: {
        eventId: event.id,
        extraInformation,
      },
    });
  }

  function handleSignOff() {
    signOff({
      variables: {
        eventId: event.id,
      },
    });
  }

  return (
    <Stack direction="column" spacing={2} alignItems="stretch">
      <CountdownStatusText countdown={countdown} signupOpenDate={event.signupOpenDate} deadline={event.deadline} />
      <LoginRequired fullWidth>
        <PermissionRequired
          permission="events.add_signup"
          fallback={<Typography>Arrangementet er kun åpent for Indøk</Typography>}
        >
          <SignUpButton disabled={disabled} onSignUp={handleSignUp} onSignOff={handleSignOff} isSignedUp={isSignedUp} />
        </PermissionRequired>
      </LoginRequired>
      {!isSignedUp && event.hasExtraInformation && (
        <TextField
          variant="filled"
          onChange={(e) => setExtraInformation(e.target.value)}
          label="Ekstra informasjon"
          required
          multiline
          helperText="Arrangøren krever at du fyller ut ekstra informasjon for påmelding."
        />
      )}
      {event.bindingSignup && (
        <Typography variant="caption" color="warning.main">
          Arrangementet har bindende påmelding
        </Typography>
      )}
    </Stack>
  );
};
