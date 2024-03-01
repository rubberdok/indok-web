import { useMutation } from "@apollo/client";
import { Alert, Unstable_Grid2 as Grid, Snackbar, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

import { LoginRequired, PermissionRequired } from "@/components/Auth";
import { FragmentType, getFragmentData, graphql } from "@/gql/pages";
import { FeaturePermission, SignUpAvailability } from "@/gql/pages/graphql";
import dayjs from "@/lib/date";

import { CountdownStatusText } from "./Countdown";
import { useCountdown } from "./hooks/useCountdown";
import { SignUpButton } from "./SignUpButton";

const ActionEventFragment = graphql(`
  fragment Action_EventFragment on Event {
    id
    signUpDetails {
      signUpsStartAt
      signUpsEndAt
    }
    signUpAvailability
    signUpsRetractable
    signUpsRequireUserProvidedInformation
    signUp {
      id
      participationStatus
      approximatePositionOnWaitList
    }
  }
`);

type Props = {
  event: FragmentType<typeof ActionEventFragment>;
};

export const Actions: React.FC<Props> = (props) => {
  const [extraInformation, setExtraInformation] = useState<string | null>(null);
  const event = getFragmentData(ActionEventFragment, props.event);

  const [alert, setAlert] = useState<
    | {
        severity: "success" | "error" | "info";
        message: string;
      }
    | undefined
  >(undefined);

  const [signUp] = useMutation(
    graphql(`
      mutation EventSignUp($data: SignUpInput!) {
        signUp(data: $data) {
          signUp {
            id
            participationStatus
            event {
              user {
                ticket {
                  id
                  paymentStatus
                }
              }
              id
              signUpAvailability
            }
          }
        }
      }
    `),
    {
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
    }
  );
  const [signOff] = useMutation(
    graphql(`
      mutation EventRetractSignUp($data: RetractSignUpInput!) {
        retractSignUp(data: $data) {
          signUp {
            id
            participationStatus
            event {
              id
              signUpAvailability
            }
          }
        }
      }
    `),
    {
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
    }
  );

  const countdown = useCountdown(event.signUpDetails?.signUpsStartAt);

  const isSignedUp =
    event.signUpAvailability === SignUpAvailability.Confirmed ||
    event.signUpAvailability === SignUpAvailability.OnWaitlist;
  const isAttending = event.signUpAvailability === SignUpAvailability.Confirmed;
  const signUpOpen = dayjs().isBetween(event.signUpDetails?.signUpsStartAt, event.signUpDetails?.signUpsEndAt);
  const missingUserProvidedInformation =
    !isSignedUp && event.signUpsRequireUserProvidedInformation && !extraInformation;
  const disabled = (isAttending && !event.signUpsRetractable) || !signUpOpen || missingUserProvidedInformation;

  function handleSignUp() {
    signUp({
      variables: {
        data: {
          eventId: event.id,
          userProvidedInformation: extraInformation,
        },
      },
    });
  }

  function handleSignOff() {
    signOff({
      variables: {
        data: {
          eventId: event.id,
        },
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
        {event.signUpDetails && (
          <CountdownStatusText
            countdown={countdown}
            signupOpenDate={event.signUpDetails?.signUpsStartAt}
            deadline={event.signUpDetails?.signUpsEndAt}
          />
        )}
      </Grid>
      <Grid xs={12}>
        <LoginRequired fullWidth redirect>
          <PermissionRequired
            optimistic
            permission={FeaturePermission.EventWriteSignUps}
            fallback={<Typography>Arrangementet er kun åpent for Indøk</Typography>}
          >
            <Tooltip
              title={missingUserProvidedInformation && "Fyll in ekstra informasjon før påmelding"}
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
      {!isSignedUp && event.signUpsRequireUserProvidedInformation && (
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
            rows={6}
          />
        </Grid>
      )}
    </>
  );
};
