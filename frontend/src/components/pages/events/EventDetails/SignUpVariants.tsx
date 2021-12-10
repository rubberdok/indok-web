import { useQuery } from "@apollo/client";
import PermissionRequired from "@components/permissions/PermissionRequired";
import { GET_SERVER_TIME } from "@graphql/utils/time/queries";
import { Event } from "@interfaces/events";
import { User } from "@interfaces/users";
import { TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Warning } from "@material-ui/icons";
import React from "react";
import CountdownButton from "./CountdownButton";

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
}));

/*
 * What to show where the sign up button should be (if possible to sign up)
 */

type Props = {
  event: Event;
  user?: User;
  loading: boolean;
  extraInformation?: string;
  onClick: () => void;
  onExtraInformationChange: (info: string) => void;
};

const SignUpVariants: React.FC<Props> = ({
  event,
  user,
  loading,
  onClick,
  extraInformation,
  onExtraInformationChange,
}) => {
  const classes = useStyles();

  const { data: timeData } = useQuery(GET_SERVER_TIME);

  const noPhoneNumberNorAlreadySignedUp =
    !user?.phoneNumber && !event.userAttendance?.isSignedUp && !event.userAttendance?.isOnWaitingList;

  const requiresExtraInfoAndNotAlreadySignedUp =
    event.hasExtraInformation && !event.userAttendance?.isSignedUp && !event.userAttendance?.isOnWaitingList;

  const bindingSignupAndAlreadySignpedUp = event.attendable?.bindingSignup && event.userAttendance?.isSignedUp;

  const requiresExtraInfoAndExtraInfroNotFilledIn =
    event.hasExtraInformation &&
    !extraInformation &&
    !event.userAttendance?.isSignedUp &&
    !event.userAttendance?.isOnWaitingList;

  if (!event.attendable) return null;

  if (!user)
    return (
      <Typography variant="h5" gutterBottom>
        Logg inn for å melde deg på
      </Typography>
    );

  if (!event.allowedGradeYears.includes(user.gradeYear))
    return (
      <Typography variant="h5" gutterBottom>
        Ikke aktuell
      </Typography>
    );

  return (
    <>
      <PermissionRequired permission="events.add_signup">
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

        {event.attendable && (
          <CountdownButton
            countDownDate={event.attendable?.signupOpenDate}
            isSignedUp={event.userAttendance?.isSignedUp ?? false}
            isOnWaitingList={event.userAttendance?.isOnWaitingList ?? false}
            isFull={event.isFull}
            loading={loading}
            disabled={
              noPhoneNumberNorAlreadySignedUp ||
              bindingSignupAndAlreadySignpedUp ||
              requiresExtraInfoAndExtraInfroNotFilledIn
            }
            onClick={onClick}
            currentTime={timeData.serverTime}
          />
        )}
      </PermissionRequired>
    </>
  );
};

export default SignUpVariants;
