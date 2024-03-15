import { useMutation } from "@apollo/client";
import { Unstable_Grid2 as Grid, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

import { useAlerts } from "@/app/components/Alerts";
import { LoginRequired } from "@/app/components/LoginRequired";
import { PermissionRequired } from "@/app/components/PermissionRequired";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import { FeaturePermission, SignUpAvailability } from "@/gql/app/graphql";
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

  const { notify } = useAlerts();

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
        notify({
          type: "success",
          message: "Du er nå påmeldt arrangementet.",
        });
      },
      onError() {
        notify({
          type: "error",
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
        notify({
          type: "info",
          message: "Du er nå meldt av arrangementet",
        });
      },
      onError() {
        notify({
          type: "error",
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
                  type={event.signUpAvailability}
                  disabled={disabled}
                  onSignUp={handleSignUp}
                  onSignOff={handleSignOff}
                />
              </span>
            </Tooltip>
          </PermissionRequired>
        </LoginRequired>
      </Grid>
      {!isSignedUp && event.signUpsRequireUserProvidedInformation && (
        <Grid xs={12}>
          <TextField
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
