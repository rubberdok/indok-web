import { useMutation } from "@apollo/client";
import { Alert, Unstable_Grid2 as Grid, Snackbar, TextField, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useState } from "react";

import { LoginRequired, PermissionRequired } from "@/components/Auth";
import { graphql } from "@/gql";
import { EventDetailFieldsFragment } from "@/gql/graphql";

import { CountdownStatusText } from "./Countdown";
import { useCountdown } from "./hooks/useCountdown";
import { SignUpButton } from "./SignUpButton";

dayjs.extend(isBetween);

const SignUpDocument = graphql(/* GraphQL */ `
  mutation SignUp($eventId: ID!, $extraInformation: String) {
    eventSignUp(eventId: $eventId, data: { extraInformation: $extraInformation }) {
      event {
        ...EventDetailFields
      }
    }
  }
`);

const SignOffDocument = graphql(/* GraphQL */ `
  mutation SignOff($eventId: ID!) {
    eventSignOff(eventId: $eventId) {
      event {
        ...EventDetailFields
      }
    }
  }
`);

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

export const Actions: React.FC<Props> = ({ event }) => {
  const [alert, setAlert] = useState<
    | {
        severity: "success" | "error" | "info";
        message: string;
      }
    | undefined
  >(undefined);

  const [signUp] = useMutation(SignUpDocument, {
    onCompleted() {
      setAlert({
        severity: "success",
        message: "Du er nå påmeldt arrangementet.",
      });
    },
    onError() {
      setAlert({
        severity: "error",
        message: "Noe gikk galt, prøv igjen senere.",
      });
    },
  });
  const [signOff] = useMutation(SignOffDocument, {
    onCompleted() {
      setAlert({
        severity: "info",
        message: "Du er nå meldt av arrangementet",
      });
    },
    onError() {
      setAlert({
        severity: "error",
        message: "Noe gikk galt, prøv igjen senere.",
      });
    },
  });

  const [extraInformation, setExtraInformation] = useState("");
  const countdown = useCountdown(event.signupOpenDate);

  const isSignedUp = Boolean(event.userAttendance?.isSignedUp || event.userAttendance?.isOnWaitingList);
  const isAttending = Boolean(event.userAttendance?.isSignedUp);
  const needsExtraInformation = !isSignedUp && Boolean(event.hasExtraInformation && !extraInformation);
  const isBindingSignup = isAttending && Boolean(event.bindingSignup);
  const signUpOpen = dayjs().isBetween(event.signupOpenDate, event.deadline);
  const disabled = needsExtraInformation || isBindingSignup || !signUpOpen;

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
    <>
      <Snackbar open={typeof alert !== "undefined"} onClose={() => setAlert(undefined)} autoHideDuration={6000}>
        <Alert severity={alert?.severity} onClose={() => setAlert(undefined)}>
          {alert?.message}
        </Alert>
      </Snackbar>
      <Grid>
        <CountdownStatusText countdown={countdown} signupOpenDate={event.signupOpenDate} deadline={event.deadline} />
      </Grid>
      <Grid xs={12}>
        <LoginRequired fullWidth redirect>
          <PermissionRequired
            optimistic
            permission="events.add_signup"
            fallback={<Typography>Arrangementet er kun åpent for Indøk</Typography>}
          >
            <Tooltip
              title={needsExtraInformation && "Fyll in ekstra informasjon før påmelding"}
              placement="bottom"
              arrow
            >
              <span>
                <SignUpButton
                  disabled={disabled}
                  onSignUp={handleSignUp}
                  onSignOff={handleSignOff}
                  isSignedUp={isSignedUp}
                />
              </span>
            </Tooltip>
          </PermissionRequired>
        </LoginRequired>
      </Grid>
      {!isSignedUp && event.hasExtraInformation && (
        <Grid xs={12}>
          <TextField
            variant="filled"
            onChange={(e) => setExtraInformation(e.target.value)}
            value={extraInformation}
            label="Ekstra informasjon"
            required
            fullWidth
            multiline
            helperText="Må fylles ut før påmelding blir tilgjengelig."
          />
        </Grid>
      )}
    </>
  );
};
