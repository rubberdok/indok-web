import { useQuery, useMutation } from "@apollo/client";
import LoginRequired from "@components/authentication/LoginRequired";
import { GET_EVENT } from "@graphql/events/queries";
import PermissionRequired from "@components/permissions/PermissionRequired";
import { EVENT_SIGN_OFF, EVENT_SIGN_UP } from "@graphql/events/mutations";
import { GET_SERVER_TIME } from "@graphql/utils/time/queries";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { Button, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Warning } from "@material-ui/icons";
import React, { useState } from "react";
import CountdownButton from "./CountdownButton";
import { Alert as MuiAlert } from "@material-ui/lab";
import Alert from "@components/Alert";
import Link from "next/link";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  wrapIcon: {
    alignItems: "center",
    display: "inline-flex",
    width: "100%",
    marginBottom: theme.spacing(1),

    "& > svg": {
      height: "unset",
      marginRight: theme.spacing(2),
    },
  },
  extraInformation: {
    position: "relative",
    float: "right",
    paddingRight: "1em",
    paddingBottom: "1em",
  },
  boughtTicket: {
    width: "fit-content",
    marginLeft: "10%",
  },
  payButton: {
    marginLeft: "20px",
  },
}));

/*
 * What to show where the sign up button should be (if possible to sign up)
 */

type Props = {
  event: Event;
  user?: User | null;
  loading: boolean;
  extraInformation?: string;
  onExtraInformationChange: (info: string) => void;
  eventId: string;
};

const SignUpVariants: React.FC<Props> = ({
  event,
  user,
  loading,
  extraInformation,
  onExtraInformationChange,
  eventId,
}) => {
  const [snackbar, setSnackbar] = useState<
    "SignUp" | "SignOff" | "OnWaitList" | "OffWaitList" | "SignUpError" | "SignOffError" | undefined
  >(undefined);
  const classes = useStyles();
  const router = useRouter();

  const { data: timeData, error: timeError } = useQuery(GET_SERVER_TIME, { fetchPolicy: "network-only" });
  const { data: eventData, refetch: refetchEventData } = useQuery<{
    event: Event;
  }>(GET_EVENT, { variables: { id: eventId }, errorPolicy: "all" });
  const [eventSignUp, { loading: signUpLoading, error: signUpError }] = useMutation<{
    eventSignUp: { isFull: boolean };
  }>(EVENT_SIGN_UP, {
    onCompleted: () =>
      refetchEventData({ eventId }).then((res) => {
        res.data.event.attendable?.userAttendance?.isAttending ? setSnackbar("SignUp") : setSnackbar("OnWaitList");
      }),
    onError: () => setSnackbar("SignUpError"),
  });
  const [eventSignOff, { loading: signOffLoading }] = useMutation<{
    eventSignOff: { isFull: boolean };
  }>(EVENT_SIGN_OFF, {
    onCompleted: () => {
      refetchEventData({ eventId });
      if (!eventData) return;
      if (eventData.event.attendable?.userAttendance?.isAttending) setSnackbar("SignOff");
      if (eventData.event.attendable?.userAttendance?.isOnWaitingList) setSnackbar("OffWaitList");
    },
    onError: () => setSnackbar("SignOffError"),
  });

  const handleClick = () => {
    if (!user) return;
    const userAttendance = eventData?.event.attendable?.userAttendance;
    if (userAttendance?.isAttending || userAttendance?.isOnWaitingList) {
      eventSignOff({
        variables: { eventId },
      });
      return;
    }
    eventSignUp({
      variables: { eventId, data: extraInformation },
    });
  };

  const noPhoneNumberNorAlreadySignedUp =
    !user?.phoneNumber &&
    !event.attendable?.userAttendance?.isAttending &&
    !event.attendable?.userAttendance?.isOnWaitingList;
  const requiresExtraInfoAndNotAlreadySignedUp =
    event.attendable?.hasExtraInformation &&
    !event.attendable?.userAttendance?.isAttending &&
    !event.attendable?.userAttendance?.isOnWaitingList;
  const bindingSignupAndAlreadySignpedUp =
    event.attendable?.bindingSignup && event.attendable?.userAttendance?.isAttending;
  const requiresExtraInfoAndExtraInfoNotFilledIn =
    event.attendable?.hasExtraInformation &&
    !extraInformation &&
    !event.attendable?.userAttendance?.isAttending &&
    !event.attendable?.userAttendance?.isOnWaitingList;

  if (!event.attendable) return null;

  if (timeError || !timeData)
    return (
      <Typography variant="h5" gutterBottom>
        Kunne ikke hente tidspunkt.
      </Typography>
    );

  if (!user) return <LoginRequired redirect />;

  if (!event.allowedGradeYears.includes(user.gradeYear))
    return (
      <Typography variant="h5" gutterBottom>
        Ikke aktuell
      </Typography>
    );

  return (
    <PermissionRequired permission="events.add_signup" fallback={<Typography variant="body1">Ikke aktuell</Typography>}>
      {noPhoneNumberNorAlreadySignedUp && (
        <Typography variant="body1" color="error" className={classes.wrapIcon}>
          <Warning fontSize="small" />
          Du må oppgi et telefonnummer på brukeren din for å kunne melde deg på
        </Typography>
      )}

      {requiresExtraInfoAndNotAlreadySignedUp && (
        <TextField
          className={classes.extraInformation}
          label="Ekstrainformasjon"
          multiline
          rows={2}
          required
          placeholder="Skriv her..."
          variant="outlined"
          onChange={(e) => onExtraInformationChange(e.target.value)}
        />
      )}

      <CountdownButton
        countDownDate={event.attendable?.signupOpenDate}
        deadline={event.attendable?.deadline}
        startTime={event.startTime}
        isAttending={event.attendable?.userAttendance?.isAttending ?? false}
        isOnWaitingList={event.attendable?.userAttendance?.isOnWaitingList ?? false}
        isFull={event.attendable?.isFull}
        loading={loading || signUpLoading || signOffLoading}
        disabled={
          noPhoneNumberNorAlreadySignedUp ||
          bindingSignupAndAlreadySignpedUp ||
          requiresExtraInfoAndExtraInfoNotFilledIn
        }
        onClick={handleClick}
        currentTime={timeData.serverTime}
      />

      {event.attendable.product &&
        event.attendable?.userAttendance?.isAttending &&
        (event.attendable?.userAttendance.hasBoughtTicket ? (
          <MuiAlert severity="success" className={classes.boughtTicket}>
            Du har betalt for billett
          </MuiAlert>
        ) : (
          <Link
            href={`/ecommerce/checkout?productId=${event.attendable.product.id}&quantity=1&redirect=${router.asPath}`}
            passHref
          >
            <Button size="large" variant="contained" color={"primary"} className={classes.payButton}>
              Gå til betaling
            </Button>
          </Link>
        ))}

      {/* Alerts */}
      <Alert
        severity="error"
        open={snackbar === "SignUpError"}
        onClose={() => setSnackbar(undefined)}
        description={signUpError ? signUpError.message : "Påmelding feilet"}
      />
      <Alert
        open={snackbar === "SignOffError"}
        severity="error"
        onClose={() => setSnackbar(undefined)}
        description={"Avmelding feilet"}
      />
      <Alert
        severity="info"
        open={snackbar === "SignOff"}
        onClose={() => setSnackbar(undefined)}
        description={"Du er nå avmeldt"}
      />
      <Alert
        severity="success"
        open={snackbar === "SignUp"}
        onClose={() => setSnackbar(undefined)}
        description={"Du er nå påmeldt"}
      />
      <Alert
        severity="info"
        open={snackbar === "OnWaitList"}
        onClose={() => setSnackbar(undefined)}
        description={"Du er på ventelisten"}
      />
      <Alert
        severity="info"
        open={snackbar === "OffWaitList"}
        onClose={() => setSnackbar(undefined)}
        description={"Du er ikke lenger på ventelisten"}
      />
    </PermissionRequired>
  );
};

export default SignUpVariants;
